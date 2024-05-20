
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {ActivityIndicator} from 'react-native';
import Pdf from 'react-native-pdf';
const RNFS = require('react-native-fs');
import {PDFDocument} from 'pdf-lib';
import {decode as atob, encode as btoa} from 'base-64';
import SignaturePad from './SignaturePad';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

export default PDFSignature = () => {
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [getSignaturePad, setSignaturePad] = useState(false);
  const [pdfEditMode, setPdfEditMode] = useState(false);
  const [signatureBase64, setSignatureBase64] = useState(null);
  const [signatureArrayBuffer, setSignatureArrayBuffer] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null);
  const [newPdfSaved, setNewPdfSaved] = useState(false);
  const [newPdfPath, setNewPdfPath] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    if (signatureBase64) {
      setSignatureArrayBuffer(_base64ToArrayBuffer(signatureBase64));
    }
    if (newPdfSaved) {
      setFilePath(newPdfPath);
      setPdfArrayBuffer(_base64ToArrayBuffer(pdfBase64));
    }
  }, [signatureBase64, filePath, newPdfSaved]);

  // Convert a base64-encoded string into an array buffer
  const _base64ToArrayBuffer = base64 => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Convert a Uint8Array (representing binary data) into a base64-encoded string
  const _uint8ToBase64 = u8Arr => {
    const CHUNK_SIZE = 0x8000; // Arbitrary number
    let index = 0;
    const length = u8Arr.length;
    let result = '';
    let slice;
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  };
///////////upload pdf////////////
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const fileUri = res[0].uri;
      const fileName = res[0].name;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.copyFile(fileUri, destPath);
      setFilePath(destPath);
      setFileDownloaded(true);
      readFile(destPath);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        throw err;
      }
    }
  };

  const readFile = path => {
    RNFS.readFile(path, 'base64').then(contents => {
      setPdfBase64(contents);
      setPdfArrayBuffer(_base64ToArrayBuffer(contents));
    });
  };

  const getSignature = () => {
    console.log('_getSignature -> Start');
    setSignaturePad(true);
  };

  const handleSignature = signature => {
    setSignatureBase64(signature.replace('data:image/png;base64,', ''));
    setSignaturePad(false);
    setPdfEditMode(true);
  };

  const handleSingleTap = async (page, x, y) => {
    if (pdfEditMode) {
      setNewPdfSaved(false);
      setFilePath(null);
      setPdfEditMode(false);
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[page - 1];

      const signatureImage = await pdfDoc.embedPng(signatureArrayBuffer);
      if (Platform.OS === 'ios') {
        firstPage.drawImage(signatureImage, {
          x: (pageWidth * (x - 12)) / Dimensions.get('window').width,
          y: pageHeight - (pageHeight * (y + 12)) / 540,
          width: 50,
          height: 50,
        });
      } else {
        firstPage.drawImage(signatureImage, {
          x: (firstPage.getWidth() * x) / pageWidth,
          y:
            firstPage.getHeight() -
            (firstPage.getHeight() * y) / pageHeight -
            25,
          width: 50,
          height: 50,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = _uint8ToBase64(pdfBytes);
      const path = `${
        RNFS.DocumentDirectoryPath
      }/react-native_signed_${Date.now()}.pdf`;
      RNFS.writeFile(path, pdfBase64, 'base64')
        .then(success => {
          setNewPdfPath(path);
          setNewPdfSaved(true);
          setPdfBase64(pdfBase64);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  ///////////download///////
  const downloadPdf = async pdfPath => {
    try {
      const downloads = RNFS.DownloadDirectoryPath;
      const newFilePath = `${downloads}/signed_document_${Date.now()}.pdf`;

      // Copy the signed PDF to the Downloads directory
      await RNFS.copyFile(pdfPath, newFilePath);

      console.log('Downloaded:', newFilePath);

      Alert.alert('Download Success', 'PDF downloaded successfully!');
    } catch (error) {
      console.log('Error downloading PDF:', error);
      Alert.alert('Download Error', 'Failed to download PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>React Native PDF Signature</Text>
      {!fileDownloaded ? (
        <TouchableOpacity onPress={selectFile} style={styles.button2}>
          <Text style={styles.buttonText}>Upload PDF</Text>
        </TouchableOpacity>
      ) : getSignaturePad ? (
        <SignaturePad onSignatureChange={handleSignature} />
      ) : (
        <View>
          {filePath ? (
            <View>
              <Pdf
                minScale={1.0}
                maxScale={1.0}
                scale={1.0}
                spacing={0}
                fitPolicy={0}
                enablePaging={true}
                source={{uri: filePath}}
                usePDFKit={false}
                onLoadComplete={(numberOfPages, filePath, {width, height}) => {
                  setPageWidth(width);
                  setPageHeight(height);
                }}
                onPageSingleTap={(page, x, y) => {
                  handleSingleTap(page, x, y);
                }}
                onPageChanged={(page, numberOfPages) => {}}
                onError={error => {
                  console.log(error);
                }}
                onPressLink={uri => {}}
                style={styles.pdf}
              />
            </View>
          ) : (
            <>
              <View style={styles.button3}>
                <Text style={styles.buttonText}>Saving PDF....</Text>
              </View>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="green" />
              </View>
            </>
          )}

          {pdfEditMode ? (
            <View style={styles.message}>
              <Text>Touch where you want to place the signature</Text>
            </View>
          ) : (
            filePath && (
              <View>
                <TouchableOpacity onPress={getSignature} style={styles.button}>
                  <Text style={styles.buttonText}>Sign Document</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => downloadPdf(filePath)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Download Signed PDF</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#f4f4f4',
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: 540,
  },
  headerText: {
    color: '#508DBC',
    fontSize: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10,
    marginVertical: 190,
  },
  button3: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4BB543',
    padding: 10,
    marginVertical: 190,
  },
  message: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF88C',
  },
  loadingContainer: {
    position: 'absolute',
    top: 220,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
