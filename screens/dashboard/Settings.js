import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, language } from '../../utils/contants';
import { Feather } from '@expo/vector-icons';

const LinkItem = ({item, isFirst}) => (
  <TouchableOpacity style={[styles.itemContainer, isFirst ? styles.itemContainerFirst : {}]}>
    <Feather name={item.icon} color={`${colors.black}50`} size={24} />
    <Text style={styles.itemText}>{item.name}</Text>
  </TouchableOpacity>
);

export default class Settings extends React.Component{
  state = {lang: null};

  async componentDidMount() {
    let langID = await AsyncStorage.getItem('language');
    this.setState({lang: langID});
  }

  render() {
    const {lang} = this.state;
    if(!lang)
      return null;

    const profileItems = [
      {name: language[lang].account, icon: 'user'},
      {name: language[lang].appointments, icon: 'smile'},
      {name: language[lang].logout, icon: 'log-out'},
    ];
    
    const companyItems = [
      {name: language[lang].aboutUs, icon: 'alert-circle'},
      {name: language[lang].faq, icon: 'help-circle'},
      {name: language[lang].termsConditions, icon: 'book'},
      {name: language[lang].privacyPolicies, icon: 'bookmark'},
    ];
    
    const appItems = [
      {name: language[lang].language, icon: 'star'},
      {name: language[lang].aboutApp, icon: 'gitlab'},
    ];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.segment}>
          <Text style={styles.segmentTitle}>{language[lang].profile}</Text>
          <View style={styles.segmentContent}>
            {profileItems.map((profileItem, i) => (<LinkItem key={`profile-item-${i}`} {...{item: profileItem, isFirst: i === 0}} />))}
          </View>
        </View>
        <View style={styles.segment}>
          <Text style={styles.segmentTitle}>{language[lang].company}</Text>
          <View style={styles.segmentContent}>
            {companyItems.map((companyItem, i) => (<LinkItem key={`company-item-${i}`} {...{item: companyItem, isFirst: i === 0}} />))}
          </View>
        </View>
        <View style={styles.segment}>
          <Text style={styles.segmentTitle}>{language[lang].app}</Text>
          <View style={styles.segmentContent}>
            {appItems.map((appItem, i) => (<LinkItem key={`app-item-${i}`} {...{item: appItem, isFirst: i === 0}} />))}
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white, paddingHorizontal: 20},
  segment: {marginVertical: 15},
  segmentTitle: {fontFamily: 'Poppins_600SemiBold', fontSize: 24, marginBottom: 2.5},
  segmentContent: {},
  itemContainer: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderColor: `${colors.black}25`},
  itemContainerFirst: {borderTopWidth: 1},
  itemText: {color: `${colors.black}50`, marginLeft: 10, fontFamily: 'Poppins_400Regular', fontSize: 18}
});
