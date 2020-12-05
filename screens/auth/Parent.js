import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { language, colors } from "../../utils/contants";
import Input from "../../components/input";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";
import Calendar from "../../assets/images/common/calendar.png";
import MapPin from "../../assets/images/common/map-pin.png";
import Password from "../../assets/images/common/password.png";
import Phone from "../../assets/images/common/phone.png";
import TextImg from "../../assets/images/common/text.png";
import Email from "../../assets/images/common/mail.png";
import Modal from "./Modal";
import {
  getUserInfo,
  validateMail,
  registerUser,
  getStates,
  getDistricts,
} from "../../api";

export default class Parent extends React.Component {
  state = {
    lang: "",
    firstName: "",
    lastName: "",
    babyName: "",
    babyDob: "",
    phoneNo: "",
    address: "",
    password: "",
    retypePassword: "",
    email: "",
    city: "",
    state: "",
    states: [],
    districts: [],
    country: "India",
    pincode: "",
    isDobShow: false,
    isBDobShow: false,
    isLoading: false,
    visible: false,
    isState: true,
  };
  // state = {lang: '', firstName: 'Mo', lastName: 'Aj', babyName: 'Baby Tara', babyDob: new Date('2020-09-30T06:41:58.166Z'), phoneNo: '9876543210', address: 'Test', password: '123456', retypePassword: '123456', email: 'moaj2547@gmail.com', city: 'Puducherry', state: 'Pondicherry', country: 'India', pincode: '605007', isDobShow: false, isBDobShow: false, isLoading: false};

  // handleChange = (name, text) => this.setState({[name]: text});

  onChange = (event, selectedDate, setFieldValue) => {
    // const {isDobShow} = this.state;
    const currentDate = selectedDate || "";
    this.setState({
      babyDob: currentDate,
      isDobShow: false,
      isBDobShow: false,
    });
    setFieldValue("babyDob", currentDate);
  };

  dataChange = async (item, setFieldValue) => {
    let { isState } = this.state;

    if (isState) {
      await this.onStateChange(item);
    } else {
      await this.onDistrictChange(item);
    }
    await setFieldValue("state", this.state.state);
    await setFieldValue("district", this.state.district);
  };

  hideModal = () => this.setState({ visible: false });

  register = async ({
    firstName,
    lastName,
    babyName,
    babyDob,
    phoneNo,
    address,
    password,
    email,
    state,
    district,
    city,
    pincode,
  }) => {
    const { navigation } = this.props;
    this.setState({ isLoading: true });
    const regData = {
      FirstName: firstName,
      LastName: lastName,
      Image: null,
      ChildName: babyName,
      ChildDob: babyDob,
      Dob: null,
      password: password,
      UserCategoryId: 3,
      UserStatusId: 2,
      PhoneNo: phoneNo,
      Email: email,
      Address: address,
      City: city,
      District: district.id,
      State: state.id,
      Country: "India",
      Pincode: pincode,
      IsActive: true,
      CreatedBy: 1,
      UpdatedBy: 1,
    };
    await registerUser(regData).then(async (regData) => {
      const { data, code, status } = regData;
      const { UserId } = JSON.parse(data);
      if (parseInt(code) === 200) {
        await AsyncStorage.setItem("userId", UserId.toString());
        await AsyncStorage.setItem("isLoggedIn", "1");
        await AsyncStorage.setItem("babyDob", babyDob.toString());
        await AsyncStorage.setItem("userName", firstName.toString());
        await AsyncStorage.setItem("profile", "");
        navigation.dispatch(StackActions.popToTop());
        navigation.dispatch(StackActions.replace("App"));
      } else {
        this.setState({ isLoading: false });
        Alert.alert("Error", status);
      }
    });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    let lang = await AsyncStorage.getItem("language");
    let userId = await AsyncStorage.getItem("userId");
    if (userId) {
      navigation.navigate("App");
    } else {
      await getStates().then(async (data) => {
        let states = data.map((item) => {
          return { id: item.StateId, name: item.State };
        });
        if (states.length > 0) {
          await this.onStateChange(states[0]);
          await this.setState({ states });
        } else {
          await this.setState({
            states,
            state: {},
            districts: [],
            district: {},
          });
        }
      });
    }
    this.setState({ lang });
  }

  onStateChange = async (state) => {
    await getDistricts(state.id).then(async (data) => {
      let districts = data.map((item) => {
        return { id: item.DistrictId, name: item.District };
      });
      if (districts.length > 0) {
        await this.onDistrictChange(districts[0]);
        await this.setState({ state, districts });
      } else {
        await this.setState({
          state,
          districts,
          district: {},
        });
      }
    });
  };

  onDistrictChange = async (district) => {
    await this.setState({ district, isState: true });
  };

  async componentDidUpdate() {
    let userId = await AsyncStorage.getItem("userId");
    if (userId) navigation.navigate("App");
  }

  render() {
    const {
      firstName,
      lastName,
      babyName,
      babyDob,
      phoneNo,
      address,
      lang,
      password,
      retypePassword,
      email,
      city,
      state,
      district,
      pincode,
      isDobShow,
      isBDobShow,
      states,
      districts,
      isLoading,
      visible,
      isState,
    } = this.state;
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    let registerSchema = Yup.object().shape({
      firstName: Yup.string().min(2).max(20).required(),
      lastName: Yup.string().min(2).max(20).required(),
      babyName: Yup.string().min(2).max(30).required(),
      babyDob: Yup.date().max(new Date()).required(),
      phoneNo: Yup.string().min(10).max(10).matches(phoneRegExp).required(),
      address: Yup.string().min(2).required(),
      password: Yup.string().min(6).required(),
      retypePassword: Yup.string()
        .oneOf([Yup.ref("password"), null])
        .required(),
      email: Yup.string()
        .email()
        .required()
        .test(
          "is valid",
          "Already Exist",
          async (value) => (await validateMail(value)) === true
        ),
      city: Yup.string().min(2).required(),
      state: Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required(),
      }),
      district: Yup.object().shape({
        id: Yup.number().required(),
        name: Yup.string().required(),
      }),
      pincode: Yup.string().min(6).max(6).required(),
    });

    if (lang === null || language[lang] === undefined) return null;

    return (
      <View style={styles.container}>
        <Formik
          initialValues={{
            ...{
              firstName,
              lastName,
              babyName,
              babyDob,
              phoneNo,
              address,
              lang,
              password,
              retypePassword,
              email,
              city,
              state,
              district,
              pincode,
            },
          }}
          validationSchema={registerSchema}
          onSubmit={(values) => this.register(values)}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <ScrollView style={styles.scrollContainer}>
                {/* <Text>{Object.keys(errors).length > 0 && JSON.stringify(errors)}</Text> */}
                <View style={[styles.itemContainer, styles.twoItemsContainer]}>
                  <View
                    style={[
                      styles.innerItemContainerLeft,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].firstName}
                    </Text>
                    <Input
                      name="firstname"
                      placeholder=""
                      type="default"
                      image={TextImg}
                      touched={touched.firstName}
                      error={errors.firstName}
                      value={values.firstName}
                      onChange={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      editable={true}
                    />
                  </View>
                  <View
                    style={[
                      styles.innerItemContainerRight,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].lastName}
                    </Text>
                    <Input
                      name="lastName"
                      placeholder=""
                      type="default"
                      image={TextImg}
                      touched={touched.lastName}
                      error={errors.lastName}
                      value={values.lastName}
                      onChange={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      editable={true}
                    />
                  </View>
                </View>
                <View style={[styles.itemContainer, styles.twoItemsContainer]}>
                  <View
                    style={[
                      styles.innerItemContainerLeft,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].babyName}
                    </Text>
                    <Input
                      name="babyName"
                      placeholder=""
                      type="default"
                      image={TextImg}
                      touched={touched.babyName}
                      error={errors.babyName}
                      value={values.babyName}
                      onChange={handleChange("babyName")}
                      onBlur={handleBlur("babyName")}
                      editable={true}
                    />
                  </View>
                  <View
                    style={[
                      styles.innerItemContainerRight,
                      styles.scrollContainer,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => this.setState({ isBDobShow: true })}
                    >
                      <Text style={styles.labelText}>
                        {language[lang].babyDob}
                      </Text>
                      <Input
                        name="babyDob"
                        placeholder=""
                        type="default"
                        image={Calendar}
                        touched={touched.babyDob}
                        error={errors.babyDob}
                        value={values.babyDob}
                        onChange={handleChange("babyDob")}
                        onBlur={handleBlur("babyDob")}
                        editable={false}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.labelText}>{language[lang].email}</Text>
                  <Input
                    name="email"
                    placeholder=""
                    type="default"
                    image={Email}
                    touched={touched.email}
                    error={errors.email}
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    editable={true}
                  />
                </View>
                <View style={[styles.itemContainer, styles.twoItemsContainer]}>
                  <View
                    style={[
                      styles.innerItemContainerLeft,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].password}
                    </Text>
                    <Input
                      name="password"
                      placeholder="◊◊◊◊◊◊◊◊◊"
                      image={Password}
                      type="default"
                      touched={touched.password}
                      error={errors.password}
                      value={values.password}
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      editable={true}
                    />
                  </View>
                  <View
                    style={[
                      styles.innerItemContainerRight,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].retypePassword}
                    </Text>
                    <Input
                      name="retypePassword"
                      placeholder="◊◊◊◊◊◊◊◊◊"
                      image={Password}
                      type="default"
                      touched={touched.retypePassword}
                      error={errors.retypePassword}
                      value={values.retypePassword}
                      onChange={handleChange("retypePassword")}
                      onBlur={handleBlur("retypePassword")}
                      editable={true}
                    />
                  </View>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.labelText}>{language[lang].phoneNo}</Text>
                  <Input
                    name="phoneNo"
                    placeholder=""
                    type="default"
                    image={Phone}
                    touched={touched.phoneNo}
                    error={errors.phoneNo}
                    value={values.phoneNo}
                    onChange={handleChange("phoneNo")}
                    onBlur={handleBlur("phoneNo")}
                    editable={true}
                  />
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.labelText}>{language[lang].address}</Text>
                  <Input
                    name="address"
                    placeholder=""
                    type="default"
                    image={MapPin}
                    touched={touched.address}
                    error={errors.address}
                    value={values.address}
                    onChange={handleChange("address")}
                    onBlur={handleBlur("address")}
                    editable={true}
                  />
                </View>
                <View style={[styles.itemContainer, styles.twoItemsContainer]}>
                  <View
                    style={[
                      styles.innerItemContainerLeft,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>{language[lang].state}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ visible: true, isState: true })
                      }
                    >
                      <Input
                        name="state"
                        placeholder=""
                        type="default"
                        image={MapPin}
                        touched={touched.state}
                        error={errors.state}
                        value={values.state.name}
                        // onChange={handleChange("city")}
                        // onBlur={handleBlur("city")}

                        editable={false}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.innerItemContainerRight,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].district}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ visible: true, isState: false })
                      }
                    >
                      <Input
                        name="district"
                        placeholder=""
                        type="default"
                        image={MapPin}
                        touched={touched.district}
                        error={errors.district}
                        value={values.district.name}
                        // onChange={handleChange("city")}
                        // onBlur={handleBlur("city")}
                        editable={false}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.itemContainer, styles.twoItemsContainer]}>
                  <View
                    style={[
                      styles.innerItemContainerLeft,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>{language[lang].city}</Text>
                    <Input
                      name="city"
                      placeholder=""
                      type="default"
                      image={MapPin}
                      touched={touched.city}
                      error={errors.city}
                      value={values.city}
                      onChange={handleChange("city")}
                      onBlur={handleBlur("city")}
                      editable={true}
                    />
                  </View>
                  <View
                    style={[
                      styles.innerItemContainerRight,
                      styles.scrollContainer,
                    ]}
                  >
                    <Text style={styles.labelText}>
                      {language[lang].pincode}
                    </Text>
                    <Input
                      name="pincode"
                      placeholder=""
                      type="default"
                      image={Password}
                      touched={touched.pincode}
                      error={errors.pincode}
                      value={values.pincode}
                      onChange={handleChange("pincode")}
                      onBlur={handleBlur("pincode")}
                      editable={true}
                    />
                  </View>
                </View>
                {(isDobShow || isBDobShow) && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={
                      (isDobShow ? values.dob : values.babyDob) || new Date()
                    }
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={(e, selectedDate) =>
                      this.onChange(e, selectedDate, setFieldValue)
                    }
                    maximumDate={new Date()}
                  />
                )}
                <Modal
                  visible={visible}
                  hideModal={this.hideModal}
                  data={isState ? states : districts}
                  selected={isState ? state : district}
                  onChange={(item) => this.dataChange(item, setFieldValue)}
                />
              </ScrollView>
              <TouchableOpacity
                style={[styles.loginText, styles.loginSubmit]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={[styles.textStyle, styles.loginSubmitText]}>
                    {language[lang].register}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, paddingTop: 10, flex: 1 },
  labelText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: -0.3,
    fontFamily: "Poppins_400Regular",
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemContainer: { marginBottom: 10, paddingHorizontal: 20 },
  scrollContainer: { flex: 1 },
  loginText: { marginVertical: 10, marginHorizontal: 20 },
  loginSubmit: { backgroundColor: colors.primary, padding: 9, borderRadius: 5 },
  loginSubmitText: {
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontWeight: "bold",
  },
  innerItemContainerLeft: { marginRight: 5 },
  innerItemContainerRight: { marginLeft: 5 },
  twoItemsContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
