import React from 'react'
import {
     Animated,
     FlatListProps,
     FlatList,
} from 'react-native'

interface DataInterface {
     flatlistAnimation: Boolean;
}

interface ItemAnimatedFlatListInterface extends FlatListProps {
     defaultLoadedCount: Number;
     data: Array<DataInterface>;
}

export default class ItemAnimatedFlatList extends React.Component<ItemAnimatedFlatListInterface> {
     direction = 0
     x = 0
     y = 0
     onScroll = (e) => {
          let { x, y } = e.nativeEvent.contentOffset

          if (this.props.horizontal) {
               this.direction = this.x < x ? -1 : 1
               this.x = x
          } else {
               this.direction = this.y < y ? -1 : 1
               this.y = y
          }
     }

     lastVisibledIndex = 0
     onViewableItemsChanged = (...args) => {
          let changed = args[0].changed

          let lastVisibledIndex = false
          for (let changedItem of changed) {
               this.animatedValues[changedItem.index].stopAnimation()

               let toValue = 0
               if (changedItem.isViewable) {
                    toValue = 1
               } else {
                    if (changedItem.index > this.lastVisibledIndex) {
                         toValue = this.direction == -1 ? 2 : 0
                    } else {
                         toValue = this.direction == -1 ? 2 : 0
                    }
               }
               Animated.timing(this.animatedValues[changedItem.index], {
                    toValue,
                    duration: this.direction == 0 ? 0 : 300,
               }).start()

               lastVisibledIndex = changedItem.index
          }
          if (lastVisibledIndex !== false) {
               this.lastVisibledIndex = lastVisibledIndex
          }

          this.props.onViewableItemsChanged && this.props.onViewableItemsChanged(...args)
     }
     animatedValues = []
     renderItem = (...args) => {
          let { index, item } = args[0]
          let styles = []

          if (!this.animatedValues[index]) {
               this.animatedValues[index] = new Animated.Value(index < this.props.defaultLoadedCount ? 1 : 0)
          }

          if (!!this.props.horizontal) {
               styles.push({
                    flexDirection: 'row',
               })
          }

          if (item.flatlistAnimation) {
               let translateValue = this.animatedValues[index].interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [45, 0, -45],
               })
               styles.push({
                    transform: [
                         this.props.horizontal ?
                              {
                                   translateX: translateValue,
                              } : {
                                   translateY: translateValue,
                              }
                    ]
               })
          }

          if (item.type == 'children') {
               return (<Animated.View style={styles}>
                    {item.children}
               </Animated.View>)
          } else {
               args[0] = {
                    ...args[0],
                    item: item.item,
               }
               return (<Animated.View style={styles}>
                    {this.props.renderItem(...args)}
               </Animated.View>)
          }
     }

     render() {
          let datas = []
          if (this.props.children) {
               for (let children of this.props.children) {
                    datas.push({
                         type: 'children',
                         children,
                         flatlistAnimation: children.props.flatlistAnimation
                    })
               }
          }
          if (this.props.data) {
               for (let item of this.props.data) {
                    datas.push({
                         type: 'props',
                         item,
                         flatlistAnimation: item.flatlistAnimation
                    })
               }
          }

          return (<FlatList
               {...this.props}
               data={datas}
               onScroll={this.onScroll}
               onViewableItemsChanged={this.onViewableItemsChanged}
               renderItem={this.renderItem}
               keyExtractor={(item, index) => {
                    // keyExtractor를 사용자가 직접 쓸 수 있기때문에 충돌나지 않도록 한다.
                    if (item.type == 'children' || !this.props.keyExtractor) {
                         return 'default/' + index
                    } else {
                         return 'props/' + this.props.keyExtractor(item.item, index)
                    }
               }}
          />)
     }
}
