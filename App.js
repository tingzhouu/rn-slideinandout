import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';

const NAVBAR_HEIGHT = 64;
const FLOATING_ITEM_WIDTH = 100;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

const ITEMS = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default class App extends Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          // offsetAnim,
          0
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
      clampedScrollFloatingItem: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          // offsetAnim,
          0
        ),
        0,
        FLOATING_ITEM_WIDTH,
      ),
    }
  }
  render() {
    const { clampedScroll, clampedScrollFloatingItem } = this.state;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    const floatingItemTranslate = clampedScrollFloatingItem.interpolate({
      inputRange: [0, FLOATING_ITEM_WIDTH],
      outputRange: [0, (FLOATING_ITEM_WIDTH)],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <AnimatedScrollView
          style={styles.contentContainer}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              { nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }
            ],
            { useNativeDriver: true },
          )}
        >
          {ITEMS.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text>item</Text>
            </View>
          ))}
        </AnimatedScrollView>
        <Animated.View
          style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}
        >
          <Text>NAVBAR</Text>
        </Animated.View>
        <Animated.View
          style={[styles.floatingItem, { transform: [{ translateX: floatingItemTranslate }] }]}
        >
          <Text>REFER</Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: NAVBAR_HEIGHT,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 375,
    backgroundColor: 'khaki',
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'pink',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT, 
  },
  floatingItem: {
    position: 'absolute',
    bottom: 100,
    right: 0,
    width: FLOATING_ITEM_WIDTH,
    height: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
