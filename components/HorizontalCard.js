import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import COLORS from '../global/COLORS';
import FONTS from '../global/FONTS'

const HorizontalCard = ({ headerTitle, data, customStyle }) => {
  return (
    <View style={[styles.container, customStyle]}>
      <Text style={styles.title}>{headerTitle}</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item => item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity>
              <Image
                source={require('../assets/images/shoes.png')}
                style={styles.image}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

export default HorizontalCard

const styles = StyleSheet.create({
  container: {
    paddingLeft: 37,
  },
  title: {
    color: COLORS.black,
    fontSize: 21,
    fontFamily: FONTS.DMSansBold,
    marginBottom: 16
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 3,
    paddingVertical: 5,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 5,
  }
})