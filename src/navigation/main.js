import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {useWindowDimensions} from 'react-native';
import {BaseColor} from '@config';

// Dashboard
import ViewCatalogue from '@screens/ViewCatalogue';
import Catalogue from '@screens/Catalogue';
// import Partners from '@screens/Partners';
import Orders from '@screens/Orders';
import About from '@screens/About';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import ProductDetail from '@screens/ProductDetail';
import ProductShow from '@screens/ProductShow';
import Cart from '@screens/Cart';
import Payment from '@screens/Payment';
// import Card from '@screens/Card';
import OrdersStatus from '@screens/OrdersStatus';
import Address1 from '@screens/Address1';
import SearchAddress from '@screens/SearchAddress';
import Article from '@screens/Article';
import Profile from '@screens/Profile';
import ProfileEdit from '@screens/ProfileEdit';
// import Category from '@screens/Category';

// Profile Stack
// import SetLocation from '@screens/SetLocation';
import DrawerContent from '@screens/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerStack() {
  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      drawerStyle={{width: (dimensions.width * 3) / 4}}
      initialRouteName="ViewCatalogue"
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: BaseColor.primaryColor,
      }}>
      <Drawer.Screen name="ViewCatalogue" component={ViewCatalogue} />
      <Drawer.Screen name="Catalogue" component={Catalogue} />
      {/* <Drawer.Screen name="Partners" component={Partners} /> */}
      <Drawer.Screen name="Orders" component={Orders} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Drawer.Screen name="ProductDetail" component={ProductDetail} />
      {/* <Drawer.Screen name="Category" component={Category} /> */}
      <Drawer.Screen name="ProductShow" component={ProductShow} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="Payment" component={Payment} />
      {/* <Drawer.Screen name="Card" component={Card} /> */}
      <Drawer.Screen name="OrdersStatus" component={OrdersStatus} />
      <Drawer.Screen name="Address1" component={Address1} />
      <Drawer.Screen name="SearchAddress" component={SearchAddress} />
      <Drawer.Screen name="Article" component={Article} />
      {/* <Drawer.Screen name="Profile" component={Profile} /> */}
      <Drawer.Screen name="ProfileEdit" component={ProfileEdit} />
    </Drawer.Navigator>
  );
}

function MainStack() {
  return (
    <AndroidBackHandler
      onBackPress={() => {
        // BackHandler.exitApp();
        // return true;
      }}>
      <Stack.Navigator initialRouteName="DrawerStack">
        <Stack.Screen
          name="DrawerStack"
          component={DrawerStack}
          options={{headerShown: false, gestureEnabled: false}}
        />
      </Stack.Navigator>
    </AndroidBackHandler>
  );
}

// export default MainDrawerNavigator;
export default MainStack;
