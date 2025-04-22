import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#091d35",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: "#091d35",
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: "1px solid #EEEEEE",
  },
  propertyCard: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 5,
    border: "1px solid #EEEEEE",
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 5,
  },
  propertyDetail: {
    fontSize: 12,
    marginBottom: 3,
    color: "#555555",
  },
  propertyImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    marginBottom: 10,
    borderRadius: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666666",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  column: {
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
    color: "#666666",
  },
  value: {
    fontSize: 12,
  },
});

// Function to convert image URL to data URL
const useImageDataUrl = (imageUrl) => {
  const [dataUrl, setDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl, {
          mode: "cors",
          cache: "force-cache",
        });
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          setDataUrl(reader.result);
          setIsLoading(false);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading image for PDF:", error);
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [imageUrl]);

  return { dataUrl, isLoading };
};

// Create PDF Document for a single property
const PropertyDocument = ({ property }) => {
  const mainImage =
    property.images && property.images.length > 0 ? property.images[0] : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Property Details</Text>
        <View style={styles.propertyCard}>
          {mainImage && (
            <Image
              src={{ uri: mainImage, cache: true }}
              style={styles.propertyImage}
            />
          )}
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyPrice}>
            ₹{property.price.toLocaleString()}
          </Text>

          <View style={styles.section}>
            <Text style={styles.subheader}>Location</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{property.location?.address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>City:</Text>
              <Text style={styles.value}>{property.location?.city}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>State:</Text>
              <Text style={styles.value}>{property.location?.state}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Zip Code:</Text>
              <Text style={styles.value}>{property.location?.zipCode}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subheader}>Property Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{property.propertyType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{property.status}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subheader}>Features</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Bedrooms:</Text>
              <Text style={styles.value}>{property.features?.bedrooms}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Bathrooms:</Text>
              <Text style={styles.value}>{property.features?.bathrooms}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Square Feet:</Text>
              <Text style={styles.value}>{property.features?.squareFeet}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Parking:</Text>
              <Text style={styles.value}>
                {property.features?.parking ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Furnished:</Text>
              <Text style={styles.value}>
                {property.features?.furnished ? "Yes" : "No"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subheader}>Description</Text>
            <Text style={styles.propertyDetail}>{property.description}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} | Estate Property
          Listing
        </Text>
      </Page>
    </Document>
  );
};

// Create PDF Document for multiple properties
const PropertiesDocument = ({ properties }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>My Properties</Text>

      {properties.map((property, index) => {
        const mainImage =
          property.images && property.images.length > 0
            ? property.images[0]
            : null;
        return (
          <View key={index} style={styles.propertyCard}>
            {mainImage && (
              <Image
                src={{ uri: mainImage, cache: true }}
                style={styles.propertyImage}
              />
            )}
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <Text style={styles.propertyPrice}>
              ₹{property.price.toLocaleString()}
            </Text>

            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>Type:</Text>
                  <Text style={styles.value}>{property.propertyType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.value}>{property.status}</Text>
                </View>
              </View>

              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.label}>Bedrooms:</Text>
                  <Text style={styles.value}>
                    {property.features?.bedrooms}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Bathrooms:</Text>
                  <Text style={styles.value}>
                    {property.features?.bathrooms}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>
                {property.location?.city}, {property.location?.state}
              </Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} | Estate Property Listing
      </Text>
    </Page>
  </Document>
);

// Image Preloading Component
const ImagePreloader = ({ imageUrl, onLoad }) => {
  const { dataUrl, isLoading } = useImageDataUrl(imageUrl);

  useEffect(() => {
    if (dataUrl && !isLoading) {
      onLoad(dataUrl);
    }
  }, [dataUrl, isLoading, onLoad]);

  return null;
};

// PDF Download Button Component with image preloading
const PDFDownloadButton = ({ properties, singleProperty = false }) => {
  const [preloadedImages, setPreloadedImages] = useState({});
  const [isPreloading, setIsPreloading] = useState(true);

  // Get list of all image URLs to preload
  const imageUrls = React.useMemo(() => {
    if (singleProperty && properties.images && properties.images.length > 0) {
      return [properties.images[0]];
    } else if (!singleProperty) {
      return properties
        .filter((p) => p.images && p.images.length > 0)
        .map((p) => p.images[0]);
    }
    return [];
  }, [properties, singleProperty]);

  // Function to handle when an image is preloaded
  const handleImagePreloaded = (url, dataUrl) => {
    setPreloadedImages((prev) => ({
      ...prev,
      [url]: dataUrl,
    }));

    // Check if all images are preloaded
    if (Object.keys(preloadedImages).length + 1 >= imageUrls.length) {
      setIsPreloading(false);
    }
  };

  // Replace image URLs with preloaded data URLs
  const getModifiedProperties = () => {
    if (singleProperty) {
      if (
        properties.images &&
        properties.images.length > 0 &&
        preloadedImages[properties.images[0]]
      ) {
        return {
          ...properties,
          images: [preloadedImages[properties.images[0]]],
        };
      }
      return properties;
    } else {
      return properties.map((property) => {
        if (
          property.images &&
          property.images.length > 0 &&
          preloadedImages[property.images[0]]
        ) {
          return {
            ...property,
            images: [preloadedImages[property.images[0]]],
          };
        }
        return property;
      });
    }
  };

  const fileName = singleProperty
    ? `property-${properties.title.replace(/\s+/g, "-").toLowerCase()}.pdf`
    : "my-properties.pdf";

  return (
    <>
      {/* Preload images */}
      {imageUrls.map((url) => (
        <ImagePreloader
          key={url}
          imageUrl={url}
          onLoad={(dataUrl) => handleImagePreloaded(url, dataUrl)}
        />
      ))}

      {/* Show loading or download button */}
      {isPreloading && imageUrls.length > 0 ? (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
        >
          <FaFilePdf />
          <span>Preparing images...</span>
        </button>
      ) : (
        <PDFDownloadLink
          document={
            singleProperty ? (
              <PropertyDocument property={getModifiedProperties()} />
            ) : (
              <PropertiesDocument properties={getModifiedProperties()} />
            )
          }
          fileName={fileName}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Generating PDF..."
            ) : (
              <>
                <FaFilePdf />
                <span>
                  {singleProperty ? "Download PDF" : "Download All as PDF"}
                </span>
              </>
            )
          }
        </PDFDownloadLink>
      )}
    </>
  );
};

export { PDFDownloadButton, PropertyDocument, PropertiesDocument };
