# D&D Campaign PDF Export - Implementation Steps

This document provides a detailed, step-by-step guide for implementing the PDF export functionality described in `instructions.md`. Use both files as reference during implementation.

## 1. Environment Setup

1. Install required dependencies:
   ```bash
   npm install pdf-lib @supabase/supabase-js
   npm install -g supabase # if not already installed
   ```

2. Supabase Configuration:
   - Create the storage bucket:
     ```bash
     supabase storage create campaign-pdfs --public
     ```
   - Update the database schema:
     ```sql
     alter table campaigns
       add column pdf_url text,
       add column maps_pdf_url text;
     ```

## 2. Edge Function Implementation

1. Create the edge function structure:
   ```bash
   supabase functions new generate-pdfs
   ```

2. Implement `supabase/functions/generate-pdfs/index.ts`:

   a. Set up the function handler:
      - Define request/response types
      - Extract campaign ID from request body
      - Initialize Supabase client with authenticated JWT

   b. Implement data fetching:
      - Retrieve campaign details (title, content, image_url, map_image_url)
      - Fetch location maps associated with the campaign
      - Validate user has access to the campaign

   c. Create PDF generation functions:
      - `buildGuidePdf(campaign)`: 
        - Create title page with campaign title and image
        - Format campaign content into sections
        - Set portrait orientation (A4/Letter)

      - `buildMapPdf(campaign, locationMaps)`:
        - First page with regional map
        - Additional pages for each location map
        - Set landscape orientation (A4/Letter)

   d. Handle image processing:
      - Fetch image buffer from URL
      - Check image size and downscale if larger than 8MB
      - Embed images into the PDFs

   e. Implement storage operations:
      - Generate file paths: `campaign-pdfs/{userId}/{campaignId}/campaign-{date}.pdf`
      - Upload PDFs to storage bucket
      - Set content type and upsert flag

   f. Update the database:
      - Update campaign record with new PDF URLs
      - Return URLs in the response

3. Deploy the edge function:
   ```bash
   supabase functions deploy generate-pdfs
   ```

## 3. Client-Side Integration

1. Update the React campaign view component:
   
   a. Add PDF generation button:
   ```tsx
   const GeneratePdfButton = () => {
     // Use campaign.pdf_url to determine button text
     return (
       <button onClick={handleBuildPdfs}>
         {campaign.pdf_url ? "Re-build PDFs" : "Build PDFs"}
       </button>
     );
   };
   ```

   b. Implement the handler function:
   ```tsx
   const handleBuildPdfs = async () => {
     // Call the edge function
     const { data, error } = await supabase.functions.invoke("generate-pdfs", {
       body: { campaignId: params.id }
     });
     
     // Handle result and update UI
     if (error) {
       // Display error message
       return;
     }
     
     // Update campaign state with new PDF URLs
     setCampaign({ ...campaign, pdf_url: data.guideUrl, maps_pdf_url: data.mapsUrl });
   };
   ```

   c. Add download links:
   ```tsx
   const PdfDownloadLinks = () => {
     if (!campaign.pdf_url && !campaign.maps_pdf_url) return null;
     
     return (
       <div className="pdf-downloads">
         {campaign.pdf_url && (
           <a href={campaign.pdf_url} download>Download Campaign Guide</a>
         )}
         {campaign.maps_pdf_url && (
           <a href={campaign.maps_pdf_url} download>Download Maps</a>
         )}
       </div>
     );
   };
   ```

## 4. Testing Process

1. Verify edge function deployment:
   ```bash
   supabase functions list
   ```

2. Test with sample campaign data:
   - Create test campaign with content and images
   - Call the edge function directly for initial testing
   - Verify PDFs are generated correctly
   - Check database updates

3. Test from UI:
   - Verify button appearance and text
   - Test generation flow
   - Confirm download links work

## 5. Common Issues and Solutions

1. Edge function timeout:
   - Break processing into smaller chunks
   - Consider moving complex operations to a dedicated service

2. Large images:
   - Implement image compression/resizing
   - Add progress indicators for large operations

3. PDF formatting:
   - Test with various content lengths
   - Ensure proper text wrapping and pagination

## Implementation Scope Boundaries

Stick to the minimal implementation as outlined in instructions.md:

- Focus on core PDF generation functionality
- Skip advanced features like table of contents, page numbers
- Implement basic UI without elaborate loading indicators
- Use direct image embedding rather than complex layout

Remember that each line of code represents potential technical debt - keep the implementation simple and focused on requirements. 