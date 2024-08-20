import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from "react"
import {ProgressBar} from "rn-multi-progress-bar"
import { SelectProvider, Select, OptionsType, OptionType } from "@mobile-reality/react-native-select-pro"

type IndexItem = {
  id: number;
  name: string;
  amount: number;
}

var items: Map<number, IndexItem> = new Map<number, IndexItem>();

var _items: IndexItem[] = [
  {
    "id": 1,
    "name": 'Bananas',
    "amount": 3,
  },
  {
    "id": 2,
    "name": 'Milk',
    "amount": 2,
  },
  {
    "id": 3,
    "name": 'Eggs',
    "amount": 2,
  },
  {
    "id": 4,
    "name": 'Peppers',
    "amount": 2,
  },
  {
    "id": 5,
    "name": 'Sour Cream',
    "amount": 2,
  },
  {
    "id": 6,
    "name": 'Cheese',
    "amount": 2,
  },
  {
    "id": 7,
    "name": 'Beans',
    "amount": 2,
  },
  {
    "id": 8,
    "name": 'Lettuce',
    "amount": 2,
  },
];


interface ItemAdditionProps{
  name: string,
  currentCount: number,
}

const HighestItemAmount:number = 5;
const DisplayDiffThreshold:number = 3;

function init(){
  // should only be called once
  items.clear();
  _items.forEach(val => items.set(val.id, val));
}

export default function TabTwoScreen() {
  init();
  const [inventoryIndex, setInventoryIndex] = useState([]);
  const [selectedItems, setSelectedItems] = useState<Map<number, IndexItem>>(new Map<number, IndexItem>());

  const [currentAdditionAmount, setcurrentAdditionAmount] = useState(1);

  const ItemAdditionOverview: React.FC<ItemAdditionProps> = ({name, currentCount}) =>{
    return (<div><ThemedText>{name}: </ThemedText><ProgressBar
    barHeight={10}
    shouldAnimate={true}
    animateDuration={500} 
    data={
      [
        {progress: currentCount, color: "rgb(230, 0, 0)"},
        {progress: Math.min(currentAdditionAmount, HighestItemAmount - currentCount), color: "rgb(0, 0, 230)"},
        {progress: (HighestItemAmount - currentCount - Math.min(currentAdditionAmount, HighestItemAmount - currentCount) / HighestItemAmount), color: "rgb(0, 210, 0)"}
      ]}
    /></div>);
  };

  // TODO: merge multiple option categories with sections support in future
  const itemSelectOptions: OptionsType< {label: string, value:string} > = _items.map((item) => { return {label: item.name, value: item.id.toString()};}) ;

  const itemAdditionOverviews = selectedItems.size > 0 && selectedItems.size <= DisplayDiffThreshold && Array.from(selectedItems.values()).map(val => <ItemAdditionOverview name={val.name} currentCount={val.amount}/>);

  const onSelect =(option: OptionType<{label:string, value:string}>, optionIndex:number) => {
          const temp = new Map(selectedItems);
          let idx = parseInt(option.value);
          if(temp.has(idx)) return;
          var item = items.get(parseInt(option.value));
          temp.set(idx, item != undefined ? item : {id: -1, name: "invalid", amount: -1});

          setSelectedItems(temp);
        }
  const onRemove = (option: OptionType<{label:string, value:string}>, optionIndex:number) => {
          const temp = new Map(selectedItems);
          if(temp.delete(parseInt(option.value)))
            setSelectedItems(temp);
        } 

  return (
      <SelectProvider>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="earth" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Add</ThemedText>
        </ThemedView>
        
        <p>{selectedItems.size}</p>
        <Select 
        multiple={true} 
        searchable={true}
        closeOptionsListOnSelect={false}
        options={itemSelectOptions}
        onSelect={onSelect}
        onRemove={onRemove}
        onSectionSelect={(options:OptionType<{label:string, value:string}>[], optionIndexes:number[]) => {options.forEach((value, index) => onSelect(value, optionIndexes[index]))}}
        onSectionRemove={(options:OptionType<{label:string, value:string}>[], optionIndexes:number[]) => {options.forEach((value, index) => onRemove(value, optionIndexes[index]))}}
         />
          {itemAdditionOverviews}


        <ThemedText>This app includes example code to help you get started.</ThemedText>
        <Collapsible title="File-based routing">
          <ThemedText>
            This app has two screens:{' '}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">app/(tabs)/add.tsx</ThemedText>
          </ThemedText>
          <ThemedText>
            The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
            sets up the tab navigator.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Android, iOS, and web support">
          <ThemedText>
            You can open this project on Android, iOS, and the web. To open the web version, press{' '}
            <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
          </ThemedText>
        </Collapsible>
        <Collapsible title="Images">
          <ThemedText>
            For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
            different screen densities
          </ThemedText>
          <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
          <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Custom fonts">
          <ThemedText>
            Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
            <ThemedText style={{ fontFamily: 'SpaceMono' }}>
              custom fonts such as this one.
            </ThemedText>
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Light and dark mode components">
          <ThemedText>
            This template has light and dark mode support. The{' '}
            <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
            what the user's current color scheme is, and so you can adjust UI colors accordingly.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Animations">
          <ThemedText>
            This template includes an example of an animated component. The{' '}
            <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
            the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
            to create a waving hand animation.
          </ThemedText>
          {Platform.select({
            ios: (
              <ThemedText>
                The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
                component provides a parallax effect for the header image.
              </ThemedText>
            ),
          })}
        </Collapsible>
      </ParallaxScrollView>
      </SelectProvider>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
