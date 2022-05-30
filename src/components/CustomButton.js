import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { logoutUser } from '../database/firebase-config'
import { Feather } from '@expo/vector-icons'
import COLORS from '../global/COLORS'
import FONTS from '../global/FONTS'
import SHADOWS from '../global/SHADOWS'


const CustomMainButton = ({ text, handlePress, customStyle }) => {
  return (
    <>
      <TouchableOpacity style={[styles.buttonContainer, customStyle]} onPress={handlePress} activeOpacity={0.5}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </>
  )
}

const CustomTextButton = ({ text, handlePress, customStyle, customTextStyle }) => {
  return (
    <>
      <TouchableOpacity style={[styles.formRegister, customStyle]} onPress={handlePress}>
        <Text style={[styles.formRegisterText, customTextStyle]}>{text}</Text>
      </TouchableOpacity>
    </>
  )
}

const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.backWrapper} onPress={() => navigation.goBack()}>
      <Feather name='chevron-left' size={25} style={styles.back} />
    </TouchableOpacity >
  )
}

const CustomMenuDrawerButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.menuWrapper} onPress={() => navigation.openDrawer()}>
      <Feather name='menu' size={25} style={styles.menu} />
    </TouchableOpacity>
  )
}

const CustomSizesButton = ({ data }) => {
  return (
    <>
      {data.sizes.map((item, index) => (
        <TouchableOpacity key={index} style={styles.sizesContainer}>
          <Text style={styles.sizesText}>{item.charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </>
  )
}

export { CustomMainButton, CustomTextButton, CustomBackButton, CustomMenuDrawerButton, CustomSizesButton }

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: -6,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    paddingVertical: 13,
    color: COLORS.white,
    fontFamily: FONTS.DMSansBold,
    fontSize: 12,
    letterSpacing: 2
  },
  formRegister: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  formRegisterText: {
    fontSize: 12,
    fontFamily: FONTS.DMSansBold,
    color: COLORS.black,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  backWrapper: {
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.dark
  },
  menuWrapper: {
    backgroundColor: COLORS.white,
    width: 54,
    height: 54,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.dark
  },
  sizesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: COLORS.gray,
    marginRight: 5,
  },
  sizesText: {
    color: COLORS.white,
    fontFamily: FONTS.DMSansBold
  }
})