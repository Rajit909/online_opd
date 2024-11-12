import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";
import images from "@/constants/images";

const Banner = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === data.length - 1 ? 0 : prevIndex + 1;
        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
        return nextIndex;
      });
    }, 3000); // 3000ms = 3 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const data  = [
    {
      id: "1",
      image: images.banner1,
      title: "Banner 1",
    },
    {
      id: "2",
      image: images.banner2,
      title: "Banner 2",
    },
    {
      id: "3",
      image: images.banner3,
      title: "Banner 3",
    },
    {
      id: "4",
      image: images.banner4,
      title: "Banner",
    }
  ]

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={item.image}
              style={styles.item}
            />
            {/* <Text style={styles.title}>{item.title}</Text> */}
          </View>
        )}
        onScrollToIndexFailed={(info) => {
          flatListRef.current.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 
    "center", 
    alignItems: "center",
    maxHeight: 180,

 },
  item: {
    width: 340,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe4ea",
    margin: 10,
    borderRadius: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
});

export default Banner;
