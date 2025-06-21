import { serve } from "$std/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';

// Types
interface Campaign {
  id: string;
  title: string;
  content: string;
  image_url: string;
  map_image_url: string;
  user_id: string;
}

interface LocationMap {
  id: string;
  campaign_id: string;
  location_name: string;
  map_image_url: string;
  user_id: string;
}

interface RequestBody {
  campaignId: string;
}

// ✅ Helper to wrap all responses with CORS headers
function withCorsHeaders(body: string, status = 200, contentType = 'application/json') {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    },
  });
}

serve(async (req) => {
  // ✅ Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  try {
    const authorization = req.headers.get('Authorization') || '';
    const jwt = authorization.replace('Bearer ', '');

    if (!jwt) {
      return withCorsHeaders(JSON.stringify({ error: 'No authorization token provided' }), 401);
    }

    const { campaignId } = await req.json() as RequestBody;

    if (!campaignId) {
      return withCorsHeaders(JSON.stringify({ error: 'Campaign ID is required' }), 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );

    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaignData) {
      return withCorsHeaders(JSON.stringify({ error: 'Failed to fetch campaign data' }), 404);
    }

    const campaign = campaignData as Campaign;

    const { data: locationMapsData, error: locationMapsError } = await supabase
      .from('location_maps')
      .select('*')
      .eq('campaign_id', campaignId);

    if (locationMapsError) {
      return withCorsHeaders(JSON.stringify({ error: 'Failed to fetch location maps' }), 500);
    }

    const locationMaps = locationMapsData as LocationMap[];

    const guideUrl = await buildGuidePdf(supabase, campaign);
    const mapsUrl = await buildMapPdf(supabase, campaign, locationMaps);

    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        campaign_pdf_url: guideUrl,
        maps_pdf_url: mapsUrl,
      })
      .eq('id', campaignId);

      if (updateError) {
        console.error('UPDATE ERROR 👉', updateError);
        return withCorsHeaders(
          JSON.stringify({ error: updateError.message ?? updateError }),
          500
        );
      }

    return withCorsHeaders(JSON.stringify({ guideUrl, mapsUrl }));
  } catch (error) {
    return withCorsHeaders(JSON.stringify({ error: error.message || 'An unexpected error occurred' }), 500);
  }
});

// ------------------------
// PDF Helper Functions
// ------------------------

async function buildGuidePdf(supabase, campaign: Campaign): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let currentPage = pdfDoc.addPage(PageSizes.A4);
  let { width, height } = currentPage.getSize();
  let currentY = height - 60; // Start from top with margin

  // Add title at the top
  const titleLines = wrapText(campaign.title, helveticaBold, 24, width - 100);
  titleLines.forEach(line => {
    currentPage.drawText(line, {
      x: 50,
      y: currentY,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= 30; // Move down for next line
  });

  currentY -= 20; // Extra space after title
  
  // Add image if available - make it fill the rest of the page
  if (campaign.image_url) {
    try {
      const imageResponse = await fetch(campaign.image_url);
      const imageArrayBuffer = await imageResponse.arrayBuffer();

      if (imageArrayBuffer.byteLength <= 8 * 1024 * 1024) {
        let pdfImage;
        if (campaign.image_url.toLowerCase().endsWith('.png')) {
          pdfImage = await pdfDoc.embedPng(imageArrayBuffer);
        } else {
          pdfImage = await pdfDoc.embedJpg(imageArrayBuffer);
        }

        // Calculate available space for image - use all remaining space on first page
        const maxWidth = width - 100;
        const maxHeight = currentY - 60; // Use all space from current position to bottom margin
        
        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;
        
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;
        
        // Scale down if image is too wide
        if (imgWidth > maxWidth) {
          finalWidth = maxWidth;
          finalHeight = (imgHeight * maxWidth) / imgWidth;
        }
        
        // Scale down if image is too tall
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = (imgWidth * maxHeight) / imgHeight;
        }

        const imageY = currentY - finalHeight;
        currentPage.drawImage(pdfImage, {
          x: (width - finalWidth) / 2,
          y: imageY,
          width: finalWidth,
          height: finalHeight,
        });
      }
    } catch (error) {
      console.error("Failed to add campaign image:", error);
    }
  }

  // Start campaign content on a new page
  if (campaign.content) {
    currentPage = pdfDoc.addPage(PageSizes.A4);
    currentY = height - 60; // Reset to top of new page

    // Split content by newlines to handle paragraphs properly
    const paragraphs = campaign.content.split('\n').filter(para => para.trim().length > 0);
    const lineHeight = 16;
    
    for (const paragraph of paragraphs) {
      const contentLines = wrapText(paragraph.trim(), helveticaFont, 12, width - 100);
      
      for (const line of contentLines) {
        // Check if we need a new page
        if (currentY < 60) {
          currentPage = pdfDoc.addPage(PageSizes.A4);
          currentY = height - 60;
        }
        
        currentPage.drawText(line, {
          x: 50,
          y: currentY,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        
        currentY -= lineHeight;
      }
      
      // Add extra space between paragraphs
      currentY -= 8;
    }
  }

  const pdfBytes = await pdfDoc.save();
  const timestamp = new Date().toISOString().substring(0, 10);
  const filePath = `${campaign.user_id}/${campaign.id}/campaign-${timestamp}.pdf`;

  const { error } = await supabase
    .storage
    .from('campaign-pdfs')
    .upload(filePath, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload campaign guide PDF: ${error.message}`);
  }

  const { data } = supabase.storage.from('campaign-pdfs').getPublicUrl(filePath);
  return data.publicUrl;
}

async function buildMapPdf(supabase, campaign: Campaign, locationMaps: LocationMap[]): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  if (campaign.map_image_url) {
    try {
      const mapPage = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
      const { width, height } = mapPage.getSize();

      mapPage.drawText("Regional Map", {
        x: 50,
        y: height - 50,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      const imageResponse = await fetch(campaign.map_image_url);
      const imageArrayBuffer = await imageResponse.arrayBuffer();

      if (imageArrayBuffer.byteLength <= 8 * 1024 * 1024) {
        let pdfImage;
        if (campaign.map_image_url.toLowerCase().endsWith('.png')) {
          pdfImage = await pdfDoc.embedPng(imageArrayBuffer);
        } else {
          pdfImage = await pdfDoc.embedJpg(imageArrayBuffer);
        }

        const maxWidth = width - 100;
        const maxHeight = height - 150;

        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;

        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgWidth > maxWidth) {
          finalWidth = maxWidth;
          finalHeight = (imgHeight * maxWidth) / imgWidth;
        }

        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = (imgWidth * maxHeight) / imgHeight;
        }

        mapPage.drawImage(pdfImage, {
          x: (width - finalWidth) / 2,
          y: (height - finalHeight) / 2,
          width: finalWidth,
          height: finalHeight,
        });
      } else {
        mapPage.drawText("(Regional map too large to embed)", {
          x: 50,
          y: height - 100,
          size: 12,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
    } catch (error) {
      console.error("Failed to add regional map:", error);
    }
  }

  for (const locationMap of locationMaps) {
    if (locationMap.map_image_url) {
      try {
        const mapPage = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
        const { width, height } = mapPage.getSize();

        const locationName = locationMap.location_name.replace(/^SUBSECTION:\s*/i, "");
        mapPage.drawText(locationName, {
          x: 50,
          y: height - 50,
          size: 20,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });

        const imageResponse = await fetch(locationMap.map_image_url);
        const imageArrayBuffer = await imageResponse.arrayBuffer();

        if (imageArrayBuffer.byteLength <= 8 * 1024 * 1024) {
          let pdfImage;
          if (locationMap.map_image_url.toLowerCase().endsWith('.png')) {
            pdfImage = await pdfDoc.embedPng(imageArrayBuffer);
          } else {
            pdfImage = await pdfDoc.embedJpg(imageArrayBuffer);
          }

          const maxWidth = width - 100;
          const maxHeight = height - 150;

          const imgWidth = pdfImage.width;
          const imgHeight = pdfImage.height;

          let finalWidth = imgWidth;
          let finalHeight = imgHeight;

          if (imgWidth > maxWidth) {
            finalWidth = maxWidth;
            finalHeight = (imgHeight * maxWidth) / imgWidth;
          }

          if (finalHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = (imgWidth * maxHeight) / imgHeight;
          }

          mapPage.drawImage(pdfImage, {
            x: (width - finalWidth) / 2,
            y: (height - finalHeight) / 2,
            width: finalWidth,
            height: finalHeight,
          });
        } else {
          mapPage.drawText("(Location map too large to embed)", {
            x: 50,
            y: height - 100,
            size: 12,
            font: helveticaFont,
            color: rgb(0.5, 0.5, 0.5),
          });
        }
      } catch (error) {
        console.error(`Failed to add location map for ${locationMap.location_name}:`, error);
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const timestamp = new Date().toISOString().substring(0, 10);
  const filePath = `${campaign.user_id}/${campaign.id}/maps-${timestamp}.pdf`;

  const { error } = await supabase
    .storage
    .from('campaign-pdfs')
    .upload(filePath, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload maps PDF: ${error.message}`);
  }

  const { data } = supabase.storage.from('campaign-pdfs').getPublicUrl(filePath);
  return data.publicUrl;
}

function wrapText(text: string, font, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    const textWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (textWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}
