import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useRef, useState } from "react"
import * as Progress from 'react-native-progress'
// import {ProgressBar} from "rn-multi-progress-bar"
import { SelectProvider, Select, OptionsType, OptionType, SelectRef } from "@mobile-reality/react-native-select-pro"

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
    return (<div><ThemedText>{name}: </ThemedText>
    <Progress.Bar progress={currentCount / HighestItemAmount} animated={true}/>
    
    {/* <ProgressBar
    barHeight={10}
    shouldAnimate={false}
    animateDuration={500} 
    data={
      [
        {progress: currentCount, color: "rgb(230, 0, 0)"},
        {progress: Math.min(currentAdditionAmount, HighestItemAmount - currentCount), color: "rgb(0, 0, 230)"},
        {progress: (HighestItemAmount - currentCount - Math.min(currentAdditionAmount, HighestItemAmount - currentCount) / HighestItemAmount), color: "rgb(0, 210, 0)"}
      ]}
    /> */}
    </div>);
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


  const selectRef = useRef<SelectRef<{label: string, value: string}>>(null);

  const onButtonPress = () => {
    // reset selected
    setSelectedItems(new Map<number, IndexItem>())
    selectRef.current?.clear();
  };

  return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="earth" style={styles.headerImage} />}>
      <SelectProvider>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Add</ThemedText>
        </ThemedView>
        <Select 
        ref={selectRef}
        multiple={true} 
        placeholderText='Select items...'
        searchable={true}
        closeOptionsListOnSelect={false}
        options={itemSelectOptions}
        onSelect={onSelect}
        onRemove={onRemove}
        onSectionSelect={(options:OptionType<{label:string, value:string}>[], optionIndexes:number[]) => {options.forEach((value, index) => onSelect(value, optionIndexes[index]))}}
        onSectionRemove={(options:OptionType<{label:string, value:string}>[], optionIndexes:number[]) => {options.forEach((value, index) => onRemove(value, optionIndexes[index]))}}
         />
          {(itemAdditionOverviews != false ? <div><ThemedText type='subtitle'>Current Stocks:</ThemedText>{itemAdditionOverviews}</div> : "")}

        <Button title="Add all" onPress={onButtonPress}/>
      </SelectProvider>
      </ParallaxScrollView>
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
