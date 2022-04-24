import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  Pressable,
  Modal,
  TextInput,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  const [todoList, setTodoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const loadData = async () => {
    const data = await AsyncStorage.getItem('todo');
    const parsed = JSON.parse(data);
    // console.log('data from  async', parsed);
    setTodoList(parsed);
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadData = data => {
    try {
      AsyncStorage.setItem('todo', JSON.stringify(data));
      closeModalHandler();
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const addTodoHandler = () => {
    // console.log('newTodo', newTodo);

    let temp = [...todoList];
    temp.push({id: todoList.length + 1, task: newTodo, status: 'p'});

    // console.log('new todo list', temp);
    setTodoList(temp);

    uploadData(temp);
  };

  const closeModalHandler = () => {
    setNewTodo('');
    setShowModal(false);
  };

  const greenTick = e => {
    let tempTodo = e;
    tempTodo.status = 'c';

    console.log(e);
    console.log(todoList);

    let tempList = [
      ...todoList.filter(item => item.id !== tempTodo.id),
      tempTodo,
    ];
    // const output = tempList.push(tempTodo);
    // console.log('tempList', tempList);
    setTodoList(tempList);

    uploadData(tempList);
  };

  const redCross = e => {
    let tempTodo = e;
    let tempList = todoList.filter(item => item.id !== tempTodo.id);
    setTodoList(tempList);

    uploadData(tempList);
  };

  const clearAll = () => {
    setTodoList([]);
    uploadData([]);
    loadData();
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <View style={styles.MainContainer}>
        <View style={{position: 'absolute', bottom: 100, right: 50, zIndex: 5}}>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={[styles.addButton, styles.add]}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={{position: 'absolute', bottom: 30, right: 50, zIndex: 5}}>
          <TouchableOpacity
            onPress={clearAll}
            style={[styles.addButton, styles.clean]}>
            <Icons name="cleaning-services" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          keyboardShouldPersistTaps={'handled'}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setShowModal(prev => !prev);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.modalText}
                editable
                value={newTodo}
                onChangeText={text => setNewTodo(text)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Pressable style={[styles.button]} onPress={addTodoHandler}>
                  <Text style={styles.textStyle}>Add</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={closeModalHandler}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeaderTitle}>Todo List</Text>
        </View>
        {todoList.filter(item => item.status === 'p').length > 0 && (
          <View style={styles.ListContainer}>
            <Text style={styles.containerHeading}>Pending Task</Text>

            {todoList
              .filter(item => item.status === 'p')
              .map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    {index + 1}. {item.task}
                  </Text>
                  <TouchableOpacity onPress={() => greenTick(item)}>
                    <View style={styles.checkContainer}>
                      <Icon name="checkcircle" size={15} color="white" />
                      {/* <Text style={{color: 'white'}}>X</Text> */}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}

        {todoList.filter(item => item.status === 'c').length > 0 && (
          <View style={styles.ListContainer2}>
            <Text style={styles.containerHeading}>Completed Task</Text>
            {todoList?.length > 0 &&
              todoList
                .filter(item => item.status === 'c')
                .map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <Text style={styles.itemText}>
                      {index + 1}. {item.task}
                    </Text>
                    <TouchableOpacity onPress={() => redCross(item)}>
                      <View style={styles.checkContainer2}>
                        <Icon name="closecircle" size={15} color="white" />
                        {/* <Text style={{color: 'white'}}>X</Text> */}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
          </View>
        )}
        {/* {(todoList.length === 0 || todoList === null) && ( */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            width: '100%',
            height: '100%',
            // backgroundColor: 'yellow',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/kairacloud/image/upload/v1650729196/healthy_sport_2-01_fkuvoc.jpg',
            }}
            width={500}
            height={500}></Image>
        </View>
        {/* )} */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    position: 'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
  },
  HeaderContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  HeaderTitle: {
    color: 'black',
    fontSize: 34,
    fontWeight: '700',
  },
  ListContainer: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 25,
    marginTop: 50,
    paddingBottom: 50,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 10,
  },
  containerHeading: {
    color: 'black',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  ListContainer2: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 25,
    marginTop: 50,
    paddingBottom: 50,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 10,
  },
  itemContainer: {
    backgroundColor: '#e9ecef',
    marginVertical: 5,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    flexDirection: 'row',
    position: 'relative',
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
  checkContainer: {
    backgroundColor: 'green',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    position: 'absolute',
    top: -15,
    right: -15,
  },
  checkContainer2: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    position: 'absolute',
    top: -15,
    right: -15,
  },
  addButton: {
    padding: 10,
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  add: {
    backgroundColor: 'green',
  },
  clean: {
    backgroundColor: '#f03e3e',
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.)',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '60%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    borderColor: 'green',
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'green',
    width: '50%',
    marginHorizontal: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'red',
    width: '50%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: 'rgba(255,212,59,0.2)',
    width: '120%',
    borderRadius: 10,
    textAlign: 'left',
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default HomePage;
