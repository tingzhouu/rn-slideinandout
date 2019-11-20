import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';

const NAVBAR_HEIGHT = 64;
const REF_ACTION_BUTTON_WIDTH = 100;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

const ITEMS = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default class App extends Component {
  constructor(props) {
    super(props);
    const scrollY = new Animated.Value(0);
    const offsetAnimRefActionButton = new Animated.Value(0);

    this.state = {
      scrollY,
      //
      offsetAnimRefActionButton,
      //
      clampedScrollRefActionButton: Animated.diffClamp(
        Animated.add(
          scrollY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnimRefActionButton,
        ),
        0,
        REF_ACTION_BUTTON_WIDTH,
      ),
    }
  }

  _clampedScrollValueRefActionButton = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  componentDidMount() {
    const { scrollY, offsetAnimRefActionButton } = this.state;
    scrollY.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValueRefActionButton = Math.min(
        Math.max(this._clampedScrollValueRefActionButton + diff, 0),
        REF_ACTION_BUTTON_WIDTH,
      );
    })
    offsetAnimRefActionButton.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const { offsetAnimRefActionButton } = this.state;

    let toValueRefActionButtonOffset = 0;
    const isPastHalfwayMarkRefActionButton = this._scrollValue > NAVBAR_HEIGHT && this._clampedScrollValueRefActionButton > (REF_ACTION_BUTTON_WIDTH) / 2;
    if (isPastHalfwayMarkRefActionButton) {
      toValueRefActionButtonOffset = this._offsetValue + REF_ACTION_BUTTON_WIDTH;
    } else {
      toValueRefActionButtonOffset = this._offsetValue - REF_ACTION_BUTTON_WIDTH;
    }
    Animated.timing(offsetAnimRefActionButton, {
      toValue: toValueRefActionButtonOffset,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { clampedScrollRefActionButton } = this.state;
    const refActionButtonTranslateX = clampedScrollRefActionButton.interpolate({
      inputRange: [0, REF_ACTION_BUTTON_WIDTH],
      outputRange: [0, (REF_ACTION_BUTTON_WIDTH)],
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
              { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
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
          style={[styles.floatingItem, { transform: [{ translateX: refActionButtonTranslateX }] }]}
        >
          <Text>YOOHOO!</Text>
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
    width: REF_ACTION_BUTTON_WIDTH,
    height: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
