import React, { useState, useEffect } from 'react'
import {
  SectionList,
  View,
  ActivityIndicator,
  Text,
  SectionListRenderItem,
} from 'react-native'
import { styles } from './styles'
import upperFirst from 'lodash.upperfirst'

interface SectionItem {
  title: String
  value: String
}

interface SectionHeader {
  title: String
}

export const InfoList = (LineGetInfo: () => void, infoTitle: String) => {
  const [info, setInfo] = useState()
  const getInfo = async () => {
    try {
      const infoResponse = await LineGetInfo()
      setInfo(infoResponse)
    } catch (error) {
      console.warn('Error', error)
    }
  }
  useEffect(() => {
    getInfo()
  }, [])
  const generateSectionData = (): SectionItem[] =>
    Object.keys(info).map(key => ({
      title: upperFirst(key),
      value: info[key] || 'N/A',
    }))

  return (
    <View style={styles.container}>
      {info ? (
        <SectionList
          sections={[
            {
              title: infoTitle,
              data: generateSectionData(),
            },
          ]}
          renderItem={renderSectionItem}
          renderSectionHeader={renderSectionHeader as any}
          keyExtractor={keyExtractor}
        />
      ) : (
        <ActivityIndicator style={styles.centering} />
      )}
    </View>
  )
}

export const renderSectionItem: SectionListRenderItem<SectionItem> = ({
  item,
}) => (
  <View style={styles.sectionItemContainer}>
    <Text style={styles.itemTitle}>{item.title}</Text>
    <Text style={styles.itemValue}>{item.value}</Text>
  </View>
)

export const renderSectionHeader: SectionListRenderItem<SectionHeader> = ({
  section,
}) => <Text style={styles.sectionHeader}>{section.title}</Text>

export const keyExtractor = (item: SectionItem, index: number) =>
  `${index}-${item.title}`
