import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import * as mime from "react-native-mime-types";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import { Avatar, Icon } from "react-native-elements";
import { colors, language } from "../../../utils/contants";
import { Button } from "react-native-paper";
import MapPin from "../../../assets/images/common/map-pin.png";
import Phone from "../../../assets/images/common/phone.png";
import TextImg from "../../../assets/images/common/text.png";
import Password from "../../../assets/images/common/password.png";
import {
  getUserInfo,
  updateUser,
  getStates,
  getDistricts,
  uploadProfile,
} from "../../../api";
import Input from "../../../components/input";
import Modal from "../../auth/Modal";
var moment = require("moment");

const userData = {
  FirstName: "",
  LastName: "",
  Image: null,
  ChildName: "",
  ChildDob: "",
  PhoneNo: "",
  Email: "",
  Address: "",
  City: "",
  District: "",
  State: "",
  Country: "",
  Pincode: "",
};
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
let registerSchema = Yup.object().shape({
  FirstName: Yup.string().min(2).max(20).required(),
  LastName: Yup.string().min(2).max(20).required(),
  ChildName: Yup.string().min(2).max(30).required(),
  PhoneNo: Yup.string().min(10).max(10).matches(phoneRegExp).required(),
  Address: Yup.string().min(2).required(),
  City: Yup.string().min(2).required(),
  state: Yup.object().shape({
    id: Yup.number().required(),
    name: Yup.string().required(),
  }),
  district: Yup.object().shape({
    id: Yup.number().required(),
    name: Yup.string().required(),
  }),
  Pincode: Yup.string().min(6).max(6).required(),
});

class Account extends React.Component {
  state = {
    lang: null,
    isLoading: true,
    edit: false,
    user: userData,
    isDobShow: false,
    isBDobShow: false,
    visible: false,
    states: [],
    districts: [],
    isState: false,
    state: {},
    district: {},
  };

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

  hideModal = () => this.setState({ visible: false });

  async componentDidMount() {
    let langID = await AsyncStorage.getItem("language");
    let userId = await AsyncStorage.getItem("userId");
    await getUserInfo(userId).then(async (data) => {
      if (data.code === "200") {
        let user = JSON.parse(data.data)[0];
        await getStates().then(async (data) => {
          let states = data.map((item) => {
            return { id: item.StateId, name: item.State };
          });
          if (states.length > 0) {
            await this.onStateChange({ id: user.Stateid, name: user.state });
            await this.setState({ states });
          } else {
            await this.setState({
              states,
              districts: [],
            });
          }
          await this.setState({
            lang: langID,
            user: user,
            isLoading: false,
            state: { id: user.Stateid, name: user.state },
            district: { id: user.Districtid, name: user.District },
          });
        });
      } else {
        this.setState({
          lang: langID,
          isLoading: false,
        });
      }
    });
  }

  register = async ({
    FirstName,
    LastName,
    ChildName,
    PhoneNo,
    Address,
    City,
    state,
    district,
    Pincode,
  }) => {
    const { user } = this.state;
    await this.setState({ isLoading: true });
    const regData = {
      ...user,
      FirstName: FirstName,
      LastName: LastName,
      ChildName: ChildName,
      PhoneNo: PhoneNo,
      Address: Address,
      City: City,
      District: district.id,
      state: state.id,
      Country: "India",
      Pincode: Pincode,
      Image: user.Image,
      IsActive: true,
      UpdatedBy: user.UserId,
    };
    await updateUser(regData, user.UserId).then(async (regData) => {
      await getUserInfo(user.UserId).then(async (data) => {
        if (data.code === "200") {
          let user = JSON.parse(data.data)[0];
          await getStates().then(async (data) => {
            let states = data.map((item) => {
              return { id: item.StateId, name: item.State };
            });
            if (states.length > 0) {
              await this.onStateChange({ id: user.Stateid, name: user.state });
              await this.setState({ states });
            } else {
              await this.setState({
                states,
                districts: [],
              });
            }
            await this.setState({
              user: user,
              isLoading: false,
              edit: false,
              state: { id: user.Stateid, name: user.state },
              district: { id: user.Districtid, name: user.District },
            });
          });
        } else {
          this.setState({
            isLoading: false,
            edit: false,
          });
        }
        // await AsyncStorage.setItem(
        //   "profile",
        //   user.Image === null ? "" : user.Image
        // );
      });
    });
  };

  getCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  pickImage = async () => {
    const upload = await this.getCameraPermission();
    if (upload) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        base64: true,
        quality: 0.5,
      });
      if (!result.cancelled) {
        let userId = await AsyncStorage.getItem("userId");
        let localUri = result.uri;
        let filename = localUri.split("/").pop();
        let formData = new FormData();
        formData.append("file", {
          uri: localUri,
          name: filename,
          type: mime.lookup(filename),
        });
        let user = {
          ...this.state.user,
          Image: localUri,
        };
        this.setState({ user });
        formData.append("id", userId);
        const config = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
        await uploadProfile(config).then(async (data) => {
          if (data.code === "200") {
            await AsyncStorage.setItem("profile", data.data);
          }
        });
      }
    } else {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
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

  onEditClick = () => this.setState({ edit: true });

  render() {
    const {
      lang,
      user,
      isLoading,
      edit,
      isDobShow,
      isBDobShow,
      state,
      states,
      district,
      districts,
      visible,
      isState,
    } = this.state;
    const {
      FirstName,
      LastName,
      ChildName,
      ChildDob,
      PhoneNo,
      Address,
      City,
      Country,
      Pincode,
    } = user;
    if (isLoading) {
      return (
        <View style={[styles.rootContainer, { alignItems: "center" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!lang) return null;

    return (
      <View style={styles.container}>
        <View style={!edit ? styles.parent : styles.editParent}>
          <View style={!edit ? styles.child : styles.editChild}>
            <Avatar
              size="large"
              rounded
              title={FirstName !== "" ? FirstName[0] : ""}
              imageProps={{ resizeMode: "cover" }}
              avatarStyle={{ backgroundColor: `${colors.black}10` }}
              source={user.Image !== null ? { uri: user.Image } : ""}
            >
              {edit && (
                <Icon
                  name="create"
                  // type="evilicon"
                  color="#517fa4"
                  onPress={() => this.pickImage()}
                  containerStyle={{
                    position: "absolute",
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: `${colors.black}`,
                    right: 0,
                  }}
                />
              )}
            </Avatar>
            <Text
              style={{
                marginTop: 10,
                fontSize: 24,
                color: `${colors.black}90`,
                fontWeight: "bold",
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              {!edit ? user.FirstName + " " + user.LastName : ""}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          {!edit ? (
            <View>
              <List.Item
                titleStyle={{
                  color: `${colors.black}90`,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
                titleNumberOfLines={7}
                title={user.Email}
                left={() => (
                  <List.Icon
                    color={`${colors.black}90`}
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    icon="gmail"
                  />
                )}
              />
              <List.Item
                titleStyle={{
                  color: `${colors.black}90`,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
                titleNumberOfLines={7}
                title={user.PhoneNo}
                left={() => (
                  <List.Icon
                    color={`${colors.black}90`}
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    icon="phone"
                  />
                )}
              />
              <List.Item
                titleStyle={{
                  color: `${colors.black}90`,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
                title={user.ChildName}
                titleNumberOfLines={7}
                left={() => (
                  <List.Icon
                    color={`${colors.black}90`}
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    icon="baby-face"
                  />
                )}
              />
              <List.Item
                titleStyle={{
                  color: `${colors.black}90`,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
                titleNumberOfLines={7}
                title={
                  user.ChildDob
                    ? user.ChildDob === ""
                      ? ""
                      : moment(user.ChildDob).format("ll")
                    : ""
                }
                left={() => (
                  <List.Icon
                    color={`${colors.black}90`}
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    icon="cake-variant"
                  />
                )}
              />
              <List.Item
                titleStyle={{
                  color: `${colors.black}90`,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
                titleNumberOfLines={7}
                title={`${user.Address}, ${user.City}, ${user.District}, ${user.state}, ${user.Country} - ${user.Pincode}`}
                left={() => (
                  <List.Icon
                    color={`${colors.black}90`}
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    icon="map-marker"
                  />
                )}
              />
            </View>
          ) : (
            <Formik
              initialValues={{
                ...{
                  FirstName,
                  LastName,
                  ChildName,
                  PhoneNo,
                  Address,
                  City,
                  state,
                  district,
                  Country,
                  Pincode,
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
                    <View
                      style={[styles.itemContainer, styles.twoItemsContainer]}
                    >
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
                          touched={touched.FirstName}
                          error={errors.FirstName}
                          value={values.FirstName}
                          onChange={handleChange("FirstName")}
                          onBlur={handleBlur("FirstName")}
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
                          touched={touched.LastName}
                          error={errors.LastName}
                          value={values.LastName}
                          onChange={handleChange("LastName")}
                          onBlur={handleBlur("LastName")}
                          editable={true}
                        />
                      </View>
                    </View>
                    <View style={styles.itemContainer}>
                      <Text style={styles.labelText}>
                        {language[lang].babyName}
                      </Text>
                      <Input
                        name="babyName"
                        placeholder=""
                        type="default"
                        image={TextImg}
                        touched={touched.ChildName}
                        error={errors.ChildName}
                        value={values.ChildName}
                        onChange={handleChange("ChildName")}
                        onBlur={handleBlur("ChildName")}
                        editable={true}
                      />
                    </View>
                    <View style={styles.itemContainer}>
                      <Text style={styles.labelText}>
                        {language[lang].phoneNo}
                      </Text>
                      <Input
                        name="phoneNo"
                        placeholder=""
                        type="default"
                        image={Phone}
                        touched={touched.PhoneNo}
                        error={errors.PhoneNo}
                        value={values.PhoneNo}
                        onChange={handleChange("PhoneNo")}
                        onBlur={handleBlur("PhoneNo")}
                        editable={true}
                      />
                    </View>
                    <View style={styles.itemContainer}>
                      <Text style={styles.labelText}>
                        {language[lang].address}
                      </Text>
                      <Input
                        name="address"
                        placeholder=""
                        type="default"
                        image={MapPin}
                        touched={touched.Address}
                        error={errors.Address}
                        value={values.Address}
                        onChange={handleChange("Address")}
                        onBlur={handleBlur("Address")}
                        editable={true}
                      />
                    </View>
                    <View
                      style={[styles.itemContainer, styles.twoItemsContainer]}
                    >
                      <View
                        style={[
                          styles.innerItemContainerLeft,
                          styles.scrollContainer,
                        ]}
                      >
                        <Text style={styles.labelText}>
                          {language[lang].city}
                        </Text>
                        <Input
                          name="city"
                          placeholder=""
                          type="default"
                          image={MapPin}
                          touched={touched.City}
                          error={errors.City}
                          value={values.City}
                          onChange={handleChange("City")}
                          onBlur={handleBlur("City")}
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
                          touched={touched.Pincode}
                          error={errors.Pincode}
                          value={values.Pincode}
                          onChange={handleChange("Pincode")}
                          onBlur={handleBlur("Pincode")}
                          editable={true}
                        />
                      </View>
                    </View>
                    <View
                      style={[styles.itemContainer, styles.twoItemsContainer]}
                    >
                      <View
                        style={[
                          styles.innerItemContainerLeft,
                          styles.scrollContainer,
                        ]}
                      >
                        <Text style={styles.labelText}>
                          {language[lang].state}
                        </Text>
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
                    <Modal
                      visible={visible}
                      hideModal={this.hideModal}
                      data={isState ? states : districts}
                      selected={isState ? state : district}
                      onChange={(item) => this.dataChange(item, setFieldValue)}
                    />
                    <View style={styles.btnContainer}>
                      <Button
                        icon={"send"}
                        mode="contained"
                        color={colors.primary}
                        style={{ width: 120 }}
                        labelStyle={{
                          color: `${colors.black}90`,
                          fontWeight: "bold",
                          fontFamily: "Poppins_600SemiBold",
                          fontSize: 16,
                        }}
                        onPress={handleSubmit}
                      >
                        {"Update"}
                      </Button>
                    </View>
                  </ScrollView>
                </>
              )}
            </Formik>
          )}
          {!edit && (
            <View style={styles.btnContainer}>
              <Button
                icon={"pencil"}
                mode="contained"
                color={colors.primary}
                style={{ width: 120 }}
                labelStyle={{
                  color: `${colors.black}90`,
                  fontWeight: "bold",
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                }}
                onPress={this.onEditClick}
              >
                {"Edit"}
              </Button>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  btnContainer: {
    alignItems: "center",
    margin: 40,
    // justifyContent: "space-between",
  },
  container: { flex: 1, backgroundColor: colors.white },
  parent: {
    height: 250,
    width: "100%",
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 300,
    borderBottomEndRadius: 300,
    overflow: "hidden",
  },
  child: {
    flex: 1,
    transform: [{ scaleX: 0.5 }],
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImg: {
    backgroundColor: colors.white,
    borderRadius: 50,
    height: 100,
    width: 100,
  },
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
  editParent: {
    backgroundColor: colors.primary,
    height: 200,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    // flex: 1 / 2.5,
  },
  editChild: {
    marginTop: 50,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Account;
