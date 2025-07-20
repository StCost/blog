import { useState } from 'react';

const ClipboardToBase64 = () => {

  const convertClipboardToBase64 = async () => {
    try {
      // Request clipboard permission and get image
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            
            // Convert blob to base64
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              
              // Copy to clipboard with complete Markdown syntax
              const markdownImage = `![Image](${base64})`;
              navigator.clipboard.writeText(markdownImage).then(() => {
                alert('Image converted to base64 and copied to clipboard!\n\nYou can now paste it directly in your Markdown:\n' + markdownImage);
              }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                alert('Base64 generated but failed to copy to clipboard. Here it is:\n\n' + markdownImage);
              });
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      
      alert('No image found in clipboard to convert into base64. Please copy an image first.');
    } catch (err) {
      console.error('Error converting clipboard to base64:', err);
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="clipboard-converter">
      <button
        onClick={convertClipboardToBase64}
        title="Convert clipboard image to base64"
      >
        📋→📄
      </button>
    </div>
  );
};

export default ClipboardToBase64; 