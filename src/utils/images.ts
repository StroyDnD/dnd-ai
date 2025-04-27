export const base64ToFile = (base64String: string, filename: string) => {
  // Remove the data URL prefix if present
  const base64Data = base64String.includes(',') 
    ? base64String.split(',')[1] 
    : base64String;
  
  // Convert base64 to binary
  const binaryData = atob(base64Data);
  
  // Create array buffer
  const byteArray = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i);
  }
  
  // Create Blob and File
  const blob = new Blob([byteArray], { type: "image/png" });
  return new File([blob], filename, { type: "image/png" });
};