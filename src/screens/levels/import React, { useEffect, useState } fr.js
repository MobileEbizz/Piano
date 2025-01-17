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
  TouchableOpacity,
} from "react-native";
import { colors } from "../../res/colors";
import { images } from "../../res/images";
import { fonts } from "../../res/fonts";
import SoundPlayer from "react-native-sound-player";
const dWidth = Dimensions.get("screen").width;
const dHeight = Dimensions.get("screen").height;
import { levelsResult, common_url } from "../../apiHelper/APIs.json";
import { chapterNumber, levelNumber, levelResult } from "../../utils/constants";
import AsyncStorage from "@react-native-community/async-storage";
export default levelOne = ({ navigation, route }) => {
  console.log("\\\\\\\\\\\\");
  const level1Data = route.params.data;
  const levelIndex = route.params.levelIndex;
  // const thisLevelData = level1Data[levelIndex];
  // const questionID = thisLevelData.level_question.split(",");
  const [data, setData] = useState();
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepOne, setStepOne] = useState(0);
  const [nodesPosition, setNodesPosition] = useState(0);
  const [nodes, setNodes] = useState(["?", "?", "?", "?"]);
  let timeInterval = null;
  const desc = [
    "Hear the 4 bass notes",
    `Choose a bass note below,\nthen tap the next box`,
    "Choose a bass note below",
  ];

  useEffect(() => {
    const onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      "FinishedPlaying",
      ({ success }) => {
        console.log("finished playing", success);
      }
    );
    const onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      "FinishedLoading",
      ({ success }) => {
        console.log("finished loading", success);
      }
    );
    const onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingFile",
      ({ success }) => {
        console.log("finished loading file", success);
      }
    );
    const onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      "FinishedLoadingURL",
      ({ success }) => {
        console.log("finished loading url", success);
      }
    );

    return () => {
      onFinishedPlayingSubscription.remove();
      onFinishedLoadingSubscription.remove();
      onFinishedLoadingFileSubscription.remove();
      onFinishedLoadingURLSubscription.remove();
    };
  }, []);

  useEffect(() => {
    myTimer();
    return () => {
      clearInterval(timeInterval);
    };
  }, []);
  const onHearBaseSound = () => {
    setStepOne(0);
    myTimer(true);
  };
  const myTimer = (isStartFromMain) => {
    let cc = 0;
    timeInterval = setInterval(() => {
      if (cc <= 3) {
        if (!isStartFromMain) {
          setProgress((prev) => prev + 12);
        }
      }
      if (cc === 4) {
        clearInterval(timeInterval);
        setStepOne(1);
        cc = 0;

        setNodesPosition(cc);
      }

      setNodesPosition(cc + 1);
      cc++;
    }, 2000);
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   if (stepOne === 0) {
  //     let hPath =
  //       thisLevelData?.options[parseInt(questionID[nodesPosition - 1])]
  //         ?.localTrackPath;
  //     playTrack(hPath);
  //   }
  // }, [nodesPosition]);

  useEffect(() => {
    getChapterInfo();
  }, []);

  const handleNodePress = (index) => {
    setNodesPosition(index); // Update nodesPosition based on the pressed node
  };

  const getChapterInfo = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "ci_session=8df9dee3c7769ea50a7671c5c4a90c54649eaa19"
    );

    var raw = JSON.stringify({
      data: {
        userId: "9712",
        chapter_id: "2",
      },
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://piano.buyhighline.in/V1.0/Piano-Admin//api/Lavel/get_chapter_Info",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result?.status == 1) {
          setData(result?.data?.chapterMoreInfo);
        }
      })
      .catch((error) => console.log("error", error));
  };

  // const onSetNodesAnswer = (keyNodes) => {
  //   let hPath = thisLevelData?.options[parseInt(keyNodes)]?.localTrackPath;
  //   playTrack(hPath);
  //   let hData = nodes;

  //   if (nodesPosition == 0) {
  //     hData[0] = keyNodes;
  //     setNodes([...hData]);
  //   } else if (nodesPosition == 1) {
  //     hData[1] = keyNodes;
  //     setNodes([...hData]);
  //   } else if (nodesPosition == 2) {
  //     hData[2] = keyNodes;
  //     setNodes([...hData]);
  //   } else if (nodesPosition == 3) {
  //     hData[3] = keyNodes;
  //     setNodes([...hData]);
  //   }

  //   if (nodesPosition <= 3) {
  //     setProgress((prev) => prev + 12);
  //   }
  //   if (nodesPosition === 4) {
  //     setStepOne((prev) => prev + 1);
  //     setProgress(100);
  //   }
  //   // setNodesPosition((prev) => prev + 1);
  // };
  const playTrack = (trackPath) => {
    if (trackPath) {
      try {
        // SoundPlayer.playUrl(trackPath, 'mp3');
        console.log("trackPath", trackPath);
        SoundPlayer.playUrl(trackPath);
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
  };
  // const onSubmit = async () => {
  //   let hCheapterNumber = await AsyncStorage.getItem(chapterNumber);
  //   let hLevelsNumber = await AsyncStorage.getItem(levelNumber);
  //   const request = {
  //     level: hLevelsNumber,
  //     cheapter: hCheapterNumber,
  //     questionID: questionID,
  //     answer: nodes,
  //     correct: true,
  //   };

  //   let hLevelResults = await AsyncStorage.getItem(levelResult);

  //   if (hLevelResults !== null) {
  //     hLevelResults = JSON.parse(hLevelResults);
  //     hLevelResults.push(request);
  //     AsyncStorage.setItem(levelResult, JSON.stringify(hLevelResults));
  //   } else {
  //     AsyncStorage.setItem(levelResult, JSON.stringify([hLevelResults]));
  //   }
  //   await AsyncStorage.setItem(levelNumber, "2");
  //   navigation.goBack();
  // };

  const currentData = data;
  console.log("currentData-----", data);
  const handleSubmit = () => {
    if (currentIndex < data?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress((currentIndex + 1) * (100 / data.length));
    } else {
      console.log("All data items have been submitted");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.creamBase1 }}>
      <StatusBar barStyle={"dark-content"} />
      <SafeAreaView />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View
          style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={images.leftArrow}
              style={{
                width: 18,
                height: 18,
                alignSelf: "center",
                resizeMode: "contain",
              }}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Image
              source={images.earIcon}
              style={{
                width: 40,
                height: 40,
                alignSelf: "center",
                marginRight: 10,
              }}
            />
          </View>
        </View>
        <View style={styles.progress}>
          <View style={[styles.progressline, { width: `${progress}%` }]} />
        </View>

        <View style={styles.playContainer}>
          <Pressable
            onPress={() => playTrack(currentData.mediaUrl)}
            style={[
              styles.playiconcontainer,
              { borderWidth: currentData.isComplete === "1" ? 0 : 4 },
            ]}
          >
            <Image source={images.ic_play} style={styles.platIconst} />
          </Pressable>
          <Text style={styles.playText}>{currentData.note || "No Name"}</Text>
          <Text style={styles.nodeDesc}>{`Status: ${currentData.status}`}</Text>
          <View style={styles.playNodecontainer}>
            {[1, 2, 3, 4, 5].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setNodesPosition(index)}
              >
                <View style={styles.nodeItem}>
                  <Text
                    style={[
                      styles.nodetext,
                      {
                        color:
                          index === nodesPosition
                            ? colors.white
                            : colors.creamBase3,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            {["", "", "", "", "", "", ""].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pianoWhite,
                  {
                    borderBottomLeftRadius: index === 0 ? 10 : 3,
                    borderBottomRightRadius: index === 6 ? 10 : 3,
                    justifyContent: "flex-end",
                  },
                ]}
              >
                {index <= currentIndex && (
                  <Pressable
                    style={{
                      backgroundColor: colors.creamBase5,
                      height: 35,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 15,
                      marginHorizontal: 3,
                      marginBottom: 2,
                    }}
                    onPress={() => onSetNodesAnswer(index + 1)}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: fonts.FBB,
                        fontSize: 20,
                      }}
                    >
                      {index + 1}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", position: "absolute" }}>
            {["", "", "", "", "", "", ""].map((_, index) =>
              index !== 2 && index !== 6 ? (
                <View
                  key={index}
                  style={[
                    styles.pianoBlack,
                    {
                      marginLeft:
                        index === 0 ? 2 + dWidth / 12 : 2 + dWidth / 20,
                    },
                  ]}
                ></View>
              ) : (
                <View
                  key={index}
                  style={[
                    styles.pianoBlack,
                    {
                      backgroundColor: "transparent",
                      marginLeft:
                        index === 0 ? 2 + dWidth / 12 : 2 + dWidth / 20,
                    },
                  ]}
                />
              )
            )}
          </View>
        </View>
      </ScrollView>
      {currentIndex < data.length && (
        <View
          style={{
            backgroundColor: colors.creamBase2,
            height: 100,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={[
              styles.btnContainer,
              { backgroundColor: colors.creamBase6 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={[styles.btnText, { color: colors.Black }]}>
              Submit
            </Text>
          </Pressable>
        </View>
      )}
    </View>
    // <View style={{ flex: 1, backgroundColor: colors.creamBase1 }}>
    //   <StatusBar barStyle={"dark-content"} />
    //   <SafeAreaView />
    //   <ScrollView style={{ paddingHorizontal: 20 }}>
    //     <View
    //       style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}
    //     >
    //       <Pressable onPress={() => navigation.goBack()}>
    //         <Image
    //           source={images.leftArrow}
    //           style={{
    //             width: 18,
    //             height: 18,
    //             alignSelf: "center",
    //             resizeMode: "contain",
    //           }}
    //         />
    //       </Pressable>
    //       <View style={{ flex: 1 }}>
    //         <Image
    //           source={images.earIcon}
    //           style={{
    //             width: 40,
    //             height: 40,
    //             alignSelf: "center",
    //             marginRight: 10,
    //           }}
    //         />
    //       </View>
    //     </View>
    //     <View style={styles.progress}>
    //       <View style={[styles.progressline, { width: `${progress}%` }]} />
    //     </View>

    //     {/* <View style={styles.playContainer}>
    //       <Pressable
    //         onPress={() => playTrack(thisLevelData.locallevelquestionaudio)}
    //         style={[
    //           styles.playiconcontainer,
    //           { borderWidth: stepOne >= 1 ? 0 : 4 },
    //         ]}
    //       >
    //         <Image source={images.ic_play} style={styles.platIconst} />
    //       </Pressable>
    //       <Text style={styles.playText}>
    //         {thisLevelData?.level_track_name || "No Name"}
    //       </Text>
    //       <Text style={styles.nodeDesc}>{desc[stepOne]}</Text>
    //       <View style={styles.playNodecontainer}>
    //         {nodes.map(
    //           (item, index) => (
    //             console.log("index", index),
    //             (
    //               <TouchableOpacity
    //                 key={index}
    //                 onPress={() => handleNodePress(index)}
    //               >
    //                 <View style={styles.nodeItem}>
    //                   <Text
    //                     style={[
    //                       styles.nodetext,
    //                       {
    //                         color:
    //                           index == nodesPosition
    //                             ? colors.white
    //                             : colors.creamBase3,
    //                       },
    //                     ]}
    //                   >
    //                     {item}
    //                   </Text>
    //                 </View>
    //               </TouchableOpacity>
    //             )
    //           )
    //         )}
    //       </View>
    //     </View>

    //     <View style={{ flex: 1 }}>
    //       <View style={{ flexDirection: "row" }}>
    //         {["", "", "", "", "", "", ""].map((_, index) => (
    //           <View
    //             style={[
    //               styles.pianoWhite,
    //               {
    //                 borderBottomLeftRadius: index === 0 ? 10 : 3,
    //                 borderBottomRightRadius: index === 6 ? 10 : 3,
    //                 justifyContent: "flex-end",
    //               },
    //             ]}
    //           >
    //             {stepOne >= 1 && (
    //               <Pressable
    //                 disabled={nodesPosition === 5}
    //                 style={{
    //                   backgroundColor: colors.creamBase5,
    //                   height: 35,
    //                   alignItems: "center",
    //                   justifyContent: "center",
    //                   borderRadius: 15,
    //                   marginHorizontal: 3,
    //                   marginBottom: 2,
    //                 }}
    //                 onPress={() => onSetNodesAnswer(index + 1)}
    //               >
    //                 <Text
    //                   style={{
    //                     color: colors.white,
    //                     fontFamily: fonts.FBB,
    //                     fontSize: 20,
    //                   }}
    //                 >
    //                   {index + 1}
    //                 </Text>
    //               </Pressable>
    //             )}
    //           </View>
    //         ))}
    //       </View>
    //       <View style={{ flexDirection: "row", position: "absolute" }}>
    //         {["", "", "", "", "", "", ""].map((_, index) =>
    //           index !== 2 && index !== 6 ? (
    //             <View
    //               style={[
    //                 styles.pianoBlack,
    //                 {
    //                   marginLeft:
    //                     index === 0 ? 2 + dWidth / 12 : 2 + dWidth / 20,
    //                 },
    //               ]}
    //             ></View>
    //           ) : (
    //             <View
    //               style={[
    //                 styles.pianoBlack,
    //                 {
    //                   backgroundColor: "transparent",
    //                   marginLeft:
    //                     index === 0 ? 2 + dWidth / 12 : 2 + dWidth / 20,
    //                 },
    //               ]}
    //             />
    //           )
    //         )}
    //       </View>
    //     </View> */}
    //   </ScrollView>
    //   {/* {stepOne === 2 && (
    //     <View
    //       style={{
    //         backgroundColor: colors.creamBase2,
    //         height: 100,
    //         alignItems: "center",
    //         flexDirection: "row",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <Pressable
    //         style={[
    //           styles.btnContainer,
    //           { backgroundColor: colors.creamBase6 },
    //         ]}
    //         onPress={onHearBaseSound}
    //       >
    //         <Text style={[styles.btnText, { color: colors.Black }]}>
    //           Hear my bassline
    //         </Text>
    //       </Pressable>
    //       <View style={{ width: 10 }} />
    //       <Pressable style={styles.btnContainer} onPress={onSubmit}>
    //         <Text style={styles.btnText}>Submit my answer</Text>
    //       </Pressable>
    //       <SafeAreaView />
    //     </View>
    //   )} */}
    // </View>
  );
};

const styles = StyleSheet.create({
  taskcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  pianoWhite: {
    width: (dWidth - 40) / 8 + 2,
    height: 100,
    backgroundColor: colors.creamBase2,
    marginRight: 3,
    borderRadius: 3,
  },
  pianoBlack: {
    width: (dWidth - 40) / 13,
    backgroundColor: colors.black,
    height: 60,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginLeft: 2 + dWidth / 12,
  },
  progress: {
    height: 16,
    backgroundColor: colors.creamBase2,
    borderRadius: 15,
    marginVertical: 20,
  },
  progressline: {
    height: 16,
    backgroundColor: colors.black,
    borderRadius: 15,
    width: "25%",
  },

  playContainer: {
    alignItems: "center",
  },
  playiconcontainer: {
    marginTop: "10%",
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.creamBase2,
    borderRadius: 100,
    borderWidth: 4,
  },
  platIconst: {
    width: 30,
    height: 30,
    marginLeft: 10,
    tintColor: colors.black,
  },
  playNodecontainer: {
    flexDirection: "row",
    marginVertical: 25,
  },

  playText: {
    color: colors.black,
    fontFamily: fonts.QE,
    fontSize: 24,
    marginVertical: 20,
    marginBottom: 10,
  },
  nodeItem: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.creamBase5,
    marginRight: 10,
  },
  nodetext: {
    color: colors.white,
    fontFamily: fonts.FBB,
    fontSize: 30,
  },
  nodeDesc: {
    color: colors.creamBase5,
    fontFamily: fonts.SM,
    fontSize: 12,
    width: "50%",
    textAlign: "center",
    height: 32,
  },
  btnContainer: {
    backgroundColor: colors.Black,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: "40%",
    alignItems: "center",
  },
  btnText: {
    color: colors.white,
    fontFamily: fonts.SM,
    fontSize: 14,
  },
});
