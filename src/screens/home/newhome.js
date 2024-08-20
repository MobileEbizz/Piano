import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../res/colors";
import { images } from "../../res/images";
import { fonts } from "../../res/fonts";
import { getData } from "../../utils/asyncStorageHelper";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";

const dWidth = Dimensions.get("screen").width;
export default newhome = ({ navigation }) => {
  const task = 8;
  const [completedTask, setCompletedTask] = useState(1);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const focus = useIsFocused();

  useEffect(() => {
    getData("setID", (success) => {
      console.log("success", success);
      setUserId(success);
    });
  }, [userId, focus]); // Dependency array empty to run only once on mount

  useEffect(() => {
    getAllLavel();
  }, [userId, focus]);

  const getAllLavel = async () => {
    console.log("111111");
    // setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "ci_session=ff9381149d25bb9d9ae0596f0d9c6c4d9daeb4eb"
    );

    let numericValue = userId.replace(/\D/g, "");
    let finalNumber = parseInt(numericValue, 10);
    console.log("finalNumber",finalNumber)
    let raw = JSON.stringify({
      data: {
        userId: finalNumber,
      },
    });

    console.log("raw", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://piano.buyhighline.in/V1.0/Piano-Admin//api/Lavel/get_lavel_list",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("get_lavel_list");
        console.log("result-------", result);
        setLevels(result?.data?.lavelList);
        setCompletedTask(result?.completedLavel);
        setData(result)
      })
      .catch((error) => console.log("error", error));
  };

  const updateLevels = (levels) => {
    let foundCompleted = false;
    return levels?.map((item, index) => {
      // If the current item is marked as complete and we haven't found a completed one yet
      if (item.isComplete === "1" && !foundCompleted) {
        foundCompleted = true; // Mark that we found a completed item
        return item; // Return the item as is
      } else {
        if (index == 0) {
          return {
            ...item,
            isComplete: "2", // Unlock this level
          };
        }
      }

      // If the previous item was completed and the current item is not completed
      if (foundCompleted && item.isComplete === "0") {
        foundCompleted = false; // Stop further unlocking
        return {
          ...item,
          isComplete: "2", // Unlock this level
        };
      }

      // Otherwise, return the item as is, keeping it locked
      return item;
    });
  };

  const changeChapter = async chapter => {
   
    setCompletedTask(chapter+1);
   
    
  };

  // Assuming `levels` is your data array
  const updatedLevels = updateLevels(levels);

  return (
    <View style={{ flex: 1, backgroundColor: colors.creamBase1 }}>
      <StatusBar barStyle={"dark-content"} />
      <SafeAreaView />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Image
          source={images.earIcon}
          style={{ width: 40, height: 40, alignSelf: "center", marginTop: 20 }}
        />
        <View style={styles.taskcontainer}>
          {data?.chapterCount?.map((item) => (
            console.log("item",item),
            console.log("completedTask",completedTask),
            <>
              <Pressable
                onPress={() => {
                  // changeChapter(item)  
                }}
                style={[
                  styles.tasksNumber,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor:
                      item <= completedTask ? colors.black : colors.creamBase2,
                    borderTopLeftRadius:
                      item >= 2 && item <= completedTask ? 0 : 100,
                    borderTopRightRadius:
                      item >= 1 && item < completedTask ? 0 : 100,
                    borderBottomLeftRadius:
                      item >= 2 && item <= completedTask ? 0 : 100,
                    borderBottomRightRadius:
                      item >= 1 && item < completedTask ? 0 : 100,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.taskText,
                    {
                      color:
                        item === completedTask
                          ? colors.white
                          : item < completedTask
                          ? colors.creamBase5
                          : colors.black,
                    },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
              <View
                style={{
                  width: 5,
                  backgroundColor:
                    item < completedTask ? colors.black : "transparent",
                }}
              />
            </>
          ))}
        </View>
        <View style={styles.hearbassContainer}>
          <Text style={styles.hearbassText}>{levels?.lessioName || ""}</Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate("quickTheory", { data: levels[completedTask] });
          }}
          style={styles.quickTheoryContainer}
        >
          <View style={styles.quickInnerContainer}>
            <Text style={styles.quickText}>{levels?.title || ""}</Text>
            <Text style={styles.quickSubText}>
              {levels?.title || ""} (you can skip it)
            </Text>
          </View>
          <View style={styles.quickIcon}></View>
        </Pressable>
        {updatedLevels?.map((item, index) => {
          console.log("--=-==", item);
          item.navigation =
            index === 0
              ? "levelOne"
              : index === 1
              ? "levelTwo"
              : index === 2
              ? "levelThird"
              : "levelFour";

          return (
            <TouchableOpacity
              style={styles.levelContainer}
              disabled={item?.isComplete === "0" ? true : false}
              onPress={() => {
                console.log("item----", item);
                if (item?.isComplete === "1") {
                  alert("This Lavel is Already Completed");
                } else if (item?.isComplete === "2") {
                  navigation.navigate("levelOne", {
                    data: item,
                    levelIndex: index,
                    userID: userId,
                  });
                }
              }}
            >
              <View style={styles.levelsTab}>
                <Text style={styles.levelText}>{item.lessioName}</Text>
                <Text style={styles.leveldesctext}>{item.note}</Text>
                {item?.isComplete === "0" && (
                  <Image
                    source={images.lock}
                    style={{
                      width: 14,
                      height: 16,
                      position: "absolute",
                      right: 15,
                      top: 20,
                      zIndex: 1000,
                      resizeMode: "stretch",
                    }}
                  />
                )}
              </View>
              <View style={styles.levelsGoal}>
                <Text style={styles.levelgoaltext}>Goal {`${"80"} %`}</Text>
                <Text style={styles.levelbesttext}>
                  Best {`${item.complateLavel} %`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <SafeAreaView />
      <Modal visible={isLoading} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: "rgba(0,0,0,.4)",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color={colors.white} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  taskcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  tasksNumber: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.creamBase2,
    borderRadius: 50,
  },
  taskText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 16,
  },
  hearbassContainer: {
    height: 250,
    backgroundColor: colors.creamBase2,
    borderRadius: 20,
    paddingVertical: 15,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 20,
  },
  hearbassText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 28,
  },
  quickTheoryContainer: {
    backgroundColor: colors.creamBase2,
    paddingVertical: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  quickInnerContainer: {
    justifyContent: "center",
    paddingLeft: "15%",
    flex: 1,
  },
  quickText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
  },
  quickSubText: {
    color: colors.creamBase5,
    fontFamily: fonts.FBB,
    fontSize: 12,
  },
  quickIcon: {
    height: 24,
    width: 24,
    backgroundColor: colors.creamBase3,
    borderRadius: 50,
  },

  levelContainer: {
    backgroundColor: colors.creamBase2,
    flexDirection: "row",
    borderRadius: 20,
    height: 80,
    marginBottom: 10,
  },
  levelsTab: {
    backgroundColor: colors.black,
    width: dWidth / 2 - 20,
    borderRadius: 20,
    paddingLeft: 20,
    justifyContent: "center",
  },
  levelText: {
    color: colors.white,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
  },
  leveldesctext: {
    color: colors.creamBase5,
    fontFamily: fonts.SM,
    fontSize: 12,
  },
  levelsGoal: {
    width: dWidth / 2 - 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  levelgoaltext: {
    color: colors.creamBase4,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
  },
  levelbesttext: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 16,
  },
});
