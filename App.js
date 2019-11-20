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
    const offsetAnimFloatingItem = new Animated.Value(0);

    this.state = {
      scrollAnim,
      //
      offsetAnimFloatingItem,
      //
      clampedScrollFloatingItem: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnimFloatingItem,
        ),
        0,
        FLOATING_ITEM_WIDTH,
      ),
    }
  }

  _clampedScrollValueFloatingItem = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  componentDidMount() {
    const { scrollAnim, offsetAnimFloatingItem } = this.state;
    scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValueFloatingItem = Math.min(
        Math.max(this._clampedScrollValueFloatingItem + diff, 0),
        FLOATING_ITEM_WIDTH,
      );
    })
    offsetAnimFloatingItem.addListener(({ value }) => {
      this._offsetValue = value;
    })
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const { offsetAnimFloatingItem } = this.state;

    let toValueFloatingItem = 0;
    const isPastHalfwayMarkFloatingItem = this._scrollValue > NAVBAR_HEIGHT && this._clampedScrollValueFloatingItem > (FLOATING_ITEM_WIDTH) / 2;
    if (isPastHalfwayMarkFloatingItem) {
      toValueFloatingItem = this._offsetValue + FLOATING_ITEM_WIDTH;
    } else {
      toValueFloatingItem = this._offsetValue - FLOATING_ITEM_WIDTH;
    }
    Animated.timing(offsetAnimFloatingItem, {
      toValue: toValueFloatingItem,
      duration: 350,
      useNativeDriver: true,
    }).start();

  };

  render() {
    const { clampedScrollFloatingItem } = this.state;
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
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
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
          style={[styles.navbar]}
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
