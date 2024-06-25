import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  CheckIcon2,
  countryDtos,
  countryDtosProps,
  countryFlags,
  RoundButton,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  sizes,
  Text,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { ListItemProps, PhoneSelectScreenProps } from './props';

const PhoneSelectScreen = ({ navigation, route }: PhoneSelectScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [filterdCountryDtos, setFilterdCountryDtos] = useState<countryDtosProps[]>(countryDtos);
  const [flagState, setFlagState] = useState<countryDtosProps>(route.params.initialFlag);

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    signUpLabel: {
      color: colors.primaryColor,
    },
    textInputSearch: {
      borderColor: colors.borderColor,
    },
  });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <View style={styles.phoneHeader}>
          <RoundButton onPress={navigation.goBack}>
            <ShortArrowIcon />
          </RoundButton>

          <TextInput
            onChangeText={text => {
              const filtered = countryDtos.filter(element => {
                if (
                  element.countryName.indexOf(text.trim()) !== -1 ||
                  `+${String(element.icc)}`.indexOf(text.trim()) !== -1
                ) {
                  return element;
                }
              });
              setFilterdCountryDtos(filtered);
            }}
            containerStyle={styles.textInputSearchContainer}
            style={[styles.textInputSearch, computedStyles.textInputSearch]}
            placeholder={t('auth_PhoneSelect_placeholderSearch')}
          />
        </View>

        <ScrollViewWithCustomScroll style={styles.flagListContainer}>
          {filterdCountryDtos.map((item, index) => (
            <ListItem
              iconSvg={countryFlags[item.countryCode]}
              icc={item.icc}
              countryName={item.countryName}
              onPress={() => {
                setFlagState(item);
                route.params.onFlagSelect(item);
              }}
              key={index}
              withCheck={item === flagState}
            />
          ))}
        </ScrollViewWithCustomScroll>
      </View>
    </SafeAreaView>
  );
};

const ListItem = ({ iconSvg, icc, countryName, style, onPress, withCheck }: ListItemProps): JSX.Element => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    listItemflagContainer: {
      borderRightColor: colors.borderColor,
    },
  });

  return (
    <Pressable style={[styles.listItemContainer, style]} onPress={onPress}>
      <View style={[styles.listItemflagContainer, computedStyles.listItemflagContainer]}>{iconSvg}</View>
      <Text style={styles.codePhone}>{`+${icc}`}</Text>
      <Text style={styles.labelPhone}>{countryName}</Text>
      {withCheck && <CheckIcon2 color={colors.primaryColor} style={styles.flagMargin} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  codePhone: {
    width: 70,
    lineHeight: 19,
  },
  labelPhone: {
    flex: 1,
    lineHeight: 19,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  listItemflagContainer: {
    borderRightWidth: 1,
    width: 41,
    marginRight: 9,
    height: 50,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  textInputSearchContainer: {
    flex: 1,
  },
  textInputSearch: {
    height: 50,
  },
  flagListContainer: {
    marginTop: 20,
    marginLeft: 0,
    marginBottom: 0,
  },
  flagMargin: {
    marginRight: 30,
  },
});

export default PhoneSelectScreen;
