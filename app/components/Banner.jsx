import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";

const Banner = ({data}) => {
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
            <Text style={styles.title}>{item.title}</Text>
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
    width: 300,
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
