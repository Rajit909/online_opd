import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Image, Dimensions } from "react-native";
import images from "@/constants/images";

// Get screen width and height
const { width, height } = Dimensions.get("window");

// You can define a dynamic width and height for banner items
const bannerWidth = width * 0.97; // 100% of screen width
const bannerHeight = height * 0.25; // 25% of screen height

const Banner = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    { id: "1", image: images.banner1, title: "Banner 1" },
    { id: "2", image: images.banner2, title: "Banner 2" },
    { id: "3", image: images.banner3, title: "Banner 3" },
    { id: "4", image: images.banner4, title: "Banner 4" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === data.length - 1 ? 0 : prevIndex + 1;
        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
        return nextIndex;
      });
    }, 3000); // Auto-scroll every 3 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle failure when scrolling to an index
  const handleScrollToIndexFailed = (info) => {
    const offset = info.averageItemLength * info.index;
    flatListRef.current.scrollToOffset({
      offset,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: bannerWidth, height: bannerHeight }]}>
            <Image
              source={item.image}
              style={styles.bannerImage}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    maxHeight: bannerHeight,
    marginTop: 10, // Adjust as needed
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe4ea",
    marginHorizontal: 5, // adjust margin based on needs
    borderRadius: 10,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default Banner;
