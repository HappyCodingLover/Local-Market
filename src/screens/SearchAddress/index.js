import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {
  View,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {SafeAreaView, Header, Text} from '@components';
import styles from './styles';
import {BaseColor, BaseSize} from '@config';
import NotFound from '../../assets/svgs/notFound.svg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class SearchAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      slidesize: Dimensions.get('window').width - 80,
      notFound: false,
      location: {
        description: '',
        coordinate: {latitude: 55.751244, longitude: 37.618423},
      },
      result: null,
      query: '',
      key: '',
      suggestionsVisible: true,
      suggestions: [],
      suggestion: null,
      token: '60d2678d4b84bf022b27ee643f49d1b1f86290b8',
      clickedIndex: 5,
    };

    this.resultListRef = React.createRef();
    this.textInputRef = React.createRef();
  }

  onFocus = () => {
    this.textInputRef && this.textInputRef.clear();
    this.setState({suggestions: [], clickedIndex: 5});
  };

  renderTextInput = () => {
    const {inputStyle} = this.props;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginRight: 10}}>
          <FeatherIcon name="search" size={20} color={'#B3B3B3'} />
        </View>
        <TextInput
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!this.props.disabled}
          onChangeText={this.onInputChange}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          placeholder={
            this.props.placeholder ? this.props.placeholder : 'Поиск...'
          }
          placeholderTextColor={'#B3B3B3'}
          ref={(ref) => (this.textInputRef = ref)}
          style={[
            styles.input,
            inputStyle,
            {marginRight: 5, width: '70%', height: 54},
          ]}
          value={this.state.query}
        />
      </View>
    );
  };

  renderSuggestionItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={(e) => this.onSuggestionClick(index, e)}
        style={{marginVertical: 7}}>
        <Text style={{fontSize: 15, color: '#262626'}}>
          {item.data.house_type && item.data.block_type
            ? item.data.street_with_type +
              ', ' +
              item.data.house_type +
              ' ' +
              item.data.house +
              ', ' +
              item.data.block_type +
              ' ' +
              item.data.block
            : item.data.house_type || item.data.block
            ? item.data.street_with_type +
              ', ' +
              item.data.house_type +
              ' ' +
              item.data.house
            : item.data.street_with_type}
        </Text>
        <Text body2 style={{color: '#585858'}}>
          {item.data.region_with_type +
            (item.data.settlement_with_type !== null
              ? item.data.settlement_with_type
              : '')}
        </Text>
      </TouchableOpacity>
    );
  };

  renderSuggestions() {
    const {ItemSeparatorComponent, keyExtractor, listStyle} = this.props;
    const {suggestions, query} = this.state;
    if (query !== '') {
      return (
        <FlatList
          ref={this.resultListRef}
          data={suggestions}
          renderItem={this.renderSuggestionItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorComponent}
          style={[styles.list, listStyle]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      );
    }
  }

  onInputFocus = () => {
    this.setState({inputFocused: true});
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
  };

  onInputBlur = () => {
    this.setState({inputFocused: false});
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
  };

  onInputChange = (value) => {
    this.setState({query: value, key: value, suggestionsVisible: true}, () => {
      this.fetchSuggestions();
    });
  };

  fetchSuggestions = () => {
    fetch(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${this.state.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: this.state.key,
          count: this.props.count ? this.props.count : 10,
          language: 'ru',
          // locations: [{ kladr_id: '50' }, { kladr_id: '77' }],
          locations: [
            {region: 'Москва'},
            {region_fias_id: '29251dcf-00a1-4e34-98d4-5c47484a36d4'},
          ],
          // locations_boost: [{ kladr_id: '77' }],
        }),
      },
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          suggestions: response.suggestions
            .filter((suggestion) => suggestion.data.street_with_type !== null)
            .filter(
              (suggestion) =>
                !suggestion.data.street_with_type?.includes('метро'),
            ),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  fecthFinalSuggestion = (suggestion) => {
    const {navigation, route} = this.props;
    fetch(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${this.state.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: suggestion,
          count: 1,
          language: 'ru',
          locations: [
            {region: 'Москва'},
            {region_fias_id: '29251dcf-00a1-4e34-98d4-5c47484a36d4'},
          ],
        }),
      },
    )
      .then((response) => response.json())
      .then((response) => {
        let lat = response.suggestions.filter(
          (suggestion) => !suggestion.data.street_with_type?.includes('метро'),
        )[0].data.geo_lat;
        let lon = response.suggestions.filter(
          (suggestion) => !suggestion.data.street_with_type?.includes('метро'),
        )[0].data.geo_lon;
        if (
          this.props.auth.addresses && this.props.auth.addresses.find(
            (address) => address.latitude === lat && address.longitude === lon,
          )
        ) {
          // aleady existing address
          Alert.alert(
            'Этот адрес уже существует.\nПопробуйте найти другой адрес.',
          );
        } else {
          if (route.params !== undefined) {
            navigation.navigate('NewAddress', {
              address: response.suggestions.filter(
                (suggestion) =>
                  !suggestion.data.street_with_type?.includes('метро'),
              )[0].data,
              from: 'Payment',
            });
          } else {
            navigation.navigate('NewAddress', {
              address: response.suggestions.filter(
                (suggestion) =>
                  !suggestion.data.street_with_type?.includes('метро'),
              )[0].data,
            });
          }
        }
      })
      .catch((error) => {
        console.error('_err_fetchFinalSuggestions', error);
      });
  };

  onSuggestionClick = (index, event) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  onSelect = (suggestion, index) => {
    if (suggestion.data.house !== null) {
      this.fecthFinalSuggestion(suggestion.value);
    } else {
      this.setState({suggestion: suggestion});
    }
  };

  selectSuggestion = (index) => {
    const {query, suggestions} = this.state;

    if (suggestions.length >= index - 1) {
      const currentSuggestion = suggestions[index];
      this.onSelect(suggestions[index], index);
      // if (suggestions.length === 1 || currentSuggestion.value === query) {
      if (suggestions.length === 1) {
        this.setState({
          // suggestionsVisible: false,
          query:
            currentSuggestion.data.house_type &&
            currentSuggestion.data.block_type
              ? currentSuggestion.data.street_with_type +
                ', ' +
                currentSuggestion.data.house_type +
                ' ' +
                currentSuggestion.data.house +
                ', ' +
                currentSuggestion.data.block_type +
                ' ' +
                currentSuggestion.data.block +
                (currentSuggestion.data.settlement_with_type !== null
                  ? ', ' + currentSuggestion.data.settlement_with_type
                  : '')
              : currentSuggestion.data.house_type ||
                currentSuggestion.data.block
              ? currentSuggestion.data.street_with_type +
                ', ' +
                currentSuggestion.data.house_type +
                ' ' +
                currentSuggestion.data.house +
                (currentSuggestion.data.settlement_with_type !== null
                  ? ', ' + currentSuggestion.data.settlement_with_type
                  : '')
              : currentSuggestion.data.street_with_type +
                (currentSuggestion.data.settlement_with_type !== null
                  ? ', ' + currentSuggestion.data.settlement_with_type
                  : ''),
          key: currentSuggestion.value,
        });
        this.onSelect(suggestions[index], index);
      } else {
        this.setState(
          {
            query:
              currentSuggestion.data.house_type &&
              currentSuggestion.data.block_type
                ? currentSuggestion.data.street_with_type +
                  ', ' +
                  currentSuggestion.data.house_type +
                  ' ' +
                  currentSuggestion.data.house +
                  ', ' +
                  currentSuggestion.data.block_type +
                  ' ' +
                  currentSuggestion.data.block +
                  (currentSuggestion.data.settlement_with_type !== null
                    ? ', ' + currentSuggestion.data.settlement_with_type
                    : '')
                : currentSuggestion.data.house_type ||
                  currentSuggestion.data.block
                ? currentSuggestion.data.street_with_type +
                  ', ' +
                  currentSuggestion.data.house_type +
                  ' ' +
                  currentSuggestion.data.house +
                  (currentSuggestion.data.settlement_with_type !== null
                    ? ', ' + currentSuggestion.data.settlement_with_type
                    : '')
                : currentSuggestion.data.street_with_type +
                  (currentSuggestion.data.settlement_with_type !== null
                    ? ', ' + currentSuggestion.data.settlement_with_type
                    : ''),
            key: currentSuggestion.value,
          },
          () => this.fetchSuggestions(),
        );
        this.textInputRef && this.textInputRef.focus();
      }
    }
  };

  checkAddress = (suggestion) => {
    if (suggestion !== null) {
      return suggestion?.value.includes(', д');
    }
  };

  clearSearch = () => {
    this.setState({query: '', key: '', suggestions: []});
  };

  render() {
    const {slidesize, suggestionsVisible, suggestions} = this.state;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <SafeAreaView style={styles.contain} forceInset={{top: 'never'}}>
          <Header
            title="Новый адрес"
            whiteHeaderColor
            renderLeft={() => {
              return (
                <FeatherIcon
                  name="menu"
                  size={BaseSize.headerMenuIconSize}
                  color={BaseColor.redColor}
                />
              );
            }}
            onPressLeft={() => {
              this.props.navigation.openDrawer();
            }}
          />
          <View style={styles.mainContainer}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.inputContainer}>
                {this.renderTextInput()}
              </View>

              <TouchableOpacity
                onPress={this.clearSearch}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text middleBody style={{color: BaseColor.redColor}}>
                  {'Удалить'}
                </Text>
              </TouchableOpacity>
            </View>
            {suggestionsVisible && suggestions && suggestions.length > 0 && (
              <View>{this.renderSuggestions()}</View>
            )}
          </View>
          {/* {notFound && <NotFound width={slidesize} height={slidesize} />} */}
          {suggestions.length === 0 && (
            <>
              <NotFound
                width={slidesize}
                height={slidesize}
                style={{alignSelf: 'center'}}
              />
              <Text title1 style={{textAlign: 'center'}}>
                {'Ничего не найдено…'}
              </Text>
            </>
          )}
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {auth: state.auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchAddress);
