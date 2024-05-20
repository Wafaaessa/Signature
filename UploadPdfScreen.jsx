import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';

const UploadPdfScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFile(res);
      setShowPdf(false); 
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picking');
      } else {
        console.log('Error picking file:', err);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }
    try {
     
      Alert.alert('Upload Successful', 'The file has been uploaded successfully.');
      setShowPdf(true); 
    } catch (error) {
      
      console.error('Upload Error:', error);

      Alert.alert('Upload Failed', 'There was an error uploading the file. Please try again later.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Button title="Pick PDF file" onPress={handleFilePick} />
      </View>
      {selectedFile && !showPdf && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ alignSelf: 'center', marginVertical: 10 }}>Selected file: {selectedFile.name}</Text>
          <Button title="Upload" onPress={handleUpload} />

        </View>
      )}
      {selectedFile && showPdf && ( 
        <View style={{ flex: 1 }}>
          <Pdf
            source={{ uri: selectedFile.uri }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              console.error(error);
            }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
};

export default UploadPdfScreen;








////////////////////////
// import React, { useState } from 'react';
// import { View, Button, Text, Alert } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';

// const UploadPdfScreen = () => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFilePick = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.pdf],
//       });
//       setSelectedFile(res);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled file picking');
//       } else {
//         console.log('Error picking file:', err);
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('pdfFile', {
//         uri: selectedFile.uri,
//         type: selectedFile.type,
//         name: selectedFile.name,
//       });

//       const response = await fetch('YOUR_UPLOAD_URL', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.ok) {
//         Alert.alert('Upload Successful', 'PDF file uploaded successfully');
//         setSelectedFile(null);
//       } else {
//         Alert.alert('Upload Failed', 'Failed to upload PDF file');
//       }
//     } catch (error) {
//       console.log('Error uploading file:', error);
//       Alert.alert('Upload Failed', 'Failed to upload PDF file');
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

//       <Button title="Pick PDF file" onPress={handleFilePick} />
//       {selectedFile && (
//         <View>
//           <Text>Selected file: {selectedFile.name}</Text>
//           <Button title="Upload" onPress={handleUpload} />
//         </View>
//       )}
//     </View>
//   );
// };

// export default UploadPdfScreen;


// ////////////////////////////download///////////////

// // import React, { useEffect } from 'react';
// // import { View, Button, Alert } from 'react-native';
// // import RNFS from 'react-native-fs';

// // const UploadPDFScreen = () => {
// //   const handleDownload = async () => {
// //     try {
// //       const downloadPath = RNFS.DownloadDirectoryPath + '/sample-file.pdf'; // Change file extension to .pdf
// //       RNFS.downloadFile({
// //         fromUrl: 'https://www.tutorialspoint.com/javascript/javascript_tutorial.pdf', // Change URL to the PDF file URL
// //         toFile: downloadPath,
// //         begin: (res) => {
// //           console.log('Download started');
// //           console.log('Content-Length:', res.contentLength);
// //         },
// //         progress: (res) => {
// //           const progressPercentage = (res.bytesWritten / res.contentLength) * 100;
// //           console.log(`Download progress: ${progressPercentage.toFixed(2)}%`);
// //         },
// //       }).promise.then((result) => {
// //         console.log('Download successful:', result);
// //         Alert.alert('File downloaded successfully');
// //       }).catch((error) => {
// //         console.log('Failed to download file:', error);
// //         Alert.alert('File download failed');
// //       });
// //     } catch (error) {
// //       console.log('FILE DOWNLOAD FAILED:', error);
// //       Alert.alert('Download failed', 'There was an error while downloading the PDF.');
// //     }
// //   };

// //   useEffect(() => {
// //     // Optional: Perform any cleanup or additional logic after the download
// //     return () => {
// //       console.log('Component will unmount. Clean up if needed.');
// //     };
// //   }, []);

// //   return (
// //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //       <Button onPress={handleDownload} title="Start Download" />
// //     </View>
// //   );
// // };

// // export default UploadPDFScreen;



