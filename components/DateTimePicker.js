import React from 'react';
import {
  View,
  Switch,
  StyleSheet,
  Text,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/nl';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isEnabled: false,
      show: false,
      mode: 'date',
      date: new Date(),
      chosenDate: '',
      chosenTime: '',
    };
  }
  onChange = (event, selectedDate) => {
    var currentDate = selectedDate || this.state.date;
    console.log(selectedDate || this.state.date);
    this.setState({ show: Platform.OS === 'ios' });
    this.setState({ date: currentDate });
    this.setState({ chosenDate: moment(currentDate).format('MMMM, Do YYYY') });
    this.setState({ chosenTime: moment(currentDate).format('h:mma') });
    this.setState({ show: false });
    // this.setState({time:currentDate})
    // console.log(selectedDate)
  };

  showMode = (currentMode) => {
    this.setState({ mode: currentMode });
    this.setState({ show: true });
  };

  showDatepicker = (datetime) => {
    this.showMode('date');
  };

  showTimepicker = (datetime) => {
    this.showMode('time');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text> Timed?</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => {
              this.setState({
                isEnabled: value,
              });
            }}
            value={this.state.isEnabled}
          />
          <View style={{ flex: 0.5 , padding:10}}>
            {this.state.isEnabled ? (
              <View>
                <View>
                  <TouchableOpacity onPress={this.showDatepicker}>
                    <Icon name="calendar" type="ionicon" color="darkblue" />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={this.showTimepicker}>
                   <Icon name="clock-o" type="FontAwesome" color="darkblue" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text>
                    Due Date: {this.state.chosenDate} and Due Time :
                    {this.state.chosenTime}
                  </Text>
                </View>
                {this.state.show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode={this.state.mode}
                    is24Hour={false}
                    display="default"
                    onChange={this.onChange}
                  />
                )}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
