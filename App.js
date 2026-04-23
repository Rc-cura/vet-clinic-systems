import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MyStyleSheet from './styles/MyStyleSheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserContext';

import LandingPage from './screens/LandingPage';
import RegisterPage from './screens/RegisterPage';
import LoginPage from './screens/LoginPage';
import Otp from './screens/Otp';
import Otplogin from './screens/Otplogin';
import DashboardPage from './screens/DashboardPage';
import PetManagementPage from './screens/PetManagementPage';
import AppointmentPage from './screens/AppointmentPage';
import BillingPage from './screens/BillingPage';
import Notification from './screens/Notification';
import AddPets from './screens/AddPets';


import ViewPetsPage from './screens/ViewPetsPage';
import EditPetsPage from './screens/EditPetsPage';
import UserProfilePage from './screens/UserProfilePage';
import EditProfilePage from './screens/EditProfilePage';
import BookAppointmentDateTime from './screens/BookAppointmentDateTime';
import BookAppointmentPets from './screens/BookAppointmentPets';
import BookAppointmentService from './screens/BookAppointmentService';
import BookAppointmentSummary from './screens/BookAppointmentSummary';
import AppointmentStatusApproved from './screens/AppointmentStatusApproved';
import AppointmentStatusCompleted from './screens/AppointmentStatusCompleted';
import AppointmentStatusPending from './screens/AppointmentStatusPending';
import AppointmentStatusCancelled from './screens/AppointmentStatusCancelled';
import AddProfilePic from './screens/AddProfilePic';
import AddDetails from './screens/AddDetails';
import ChatModule from './screens/ChatModule';
import BackgroundPage from './screens/BackgroundPage';
import AddressPage from './screens/AddressPage';
import AuthCheck from './screens/AuthCheck';
import HealthCard from './screens/HealthCard';

import TotalPending from './screens/TotalPending';
import TotalPaid from './screens/TotalPaid';
import AllInvoice from './screens/AllInvoice';
import FullInvoice from './screens/FullInvoice';
import Paid from './screens/Paid';
import Unpaid from './screens/Unpaid';
import Overdue from './screens/Overdue';
import PayTotalPending from './screens/PayTotalPending';
import PayInvoice from './screens/PayInvoice';




export const Registered = [];
export const Pets = [];

export const Appointments = [];

export default function App() {
  const MScreen = createNativeStackNavigator()

  return (
    <UserProvider>
      <NavigationContainer>
        <MScreen.Navigator initialRouteName='userprofile'>
    
   
          {/* <MScreen.Screen name='profilepic' component={AddProfilePic} />
          <MScreen.Screen name='details' component={AddDetails} />
          <MScreen.Screen name='background' component={BackgroundPage} />
          <MScreen.Screen name='address' component={AddressPage} />
          <MScreen.Screen name='chat' component={ChatModule} />
          <MScreen.Screen name='auth' component={AuthCheck} />
          <MScreen.Screen name='healthcard' component={HealthCard} /> */}

          <MScreen.Screen
            name='profilepic'
            component={AddProfilePic}
            options={{
              headerShown: false,
              title: 'Profile Pic',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='details'
            component={AddDetails}
            options={{
              headerShown: false,
              title: 'Details',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='background'
            component={BackgroundPage}
            options={{
              headerShown: false,
              title: 'Background',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='address'
            component={AddressPage}
            options={{
              headerShown: false,
              title: 'Address',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='chat'
            component={ChatModule}
            options={{
              headerShown: false,
              title: 'Chat',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='auth'
            component={AuthCheck}
            options={{
              headerShown: false,
              title: 'Auth',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='healthcard'
            component={HealthCard}
            options={{
              headerShown: false,
              title: 'Health Card',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

          
           <MScreen.Screen
            name='landing'
            component={LandingPage}
            options={{
              headerShown: false,
              title: 'Landing',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

              <MScreen.Screen
            name='login'
            component={LoginPage}
            options={{
              headerShown: false,
              title: 'Login',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

            <MScreen.Screen
            name='register'
            component={RegisterPage}
            options={{
              headerShown: false,
              title: 'Register',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

            <MScreen.Screen
            name='otp'
            component={Otp}
            options={{
              headerShown: false,
              title: 'Otp',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

               <MScreen.Screen
            name='otplogin'
            component={Otplogin}
            options={{
              headerShown: false,
              title: 'Otplogin',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

          <MScreen.Screen
            name='dashboard'
            component={DashboardPage}
            options={{
              headerShown: false,
              title: 'Home',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='pet'
            component={PetManagementPage}
            options={{
              headerShown: false,
              title: 'Pets',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='appointment'
            component={AppointmentPage}
            options={{
              headerShown: false,
              title: 'Appointment',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='billing'
            component={BillingPage}
            options={{
              headerShown: false,
              title: 'Invoice',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          
          {/* <MScreen.Screen name='notification' component={Notification} />
          <MScreen.Screen name='addpets' component={AddPets} />
          <MScreen.Screen name='viewpets' component={ViewPetsPage} />
          <MScreen.Screen name='editpets' component={EditPetsPage} />
          <MScreen.Screen name='editprofile' component={EditProfilePage} />
          <MScreen.Screen name='userprofile' component={UserProfilePage} />
          <MScreen.Screen name='selectpet' component={BookAppointmentPets} />
          <MScreen.Screen name='service' component={BookAppointmentService} />
          <MScreen.Screen name='datetime' component={BookAppointmentDateTime} />
          <MScreen.Screen name='summary' component={BookAppointmentSummary} />
          <MScreen.Screen name='completed' component={AppointmentStatusCompleted} />
          <MScreen.Screen name='pending' component={AppointmentStatusPending} />
          <MScreen.Screen name='approved' component={AppointmentStatusApproved} />
          <MScreen.Screen name='cancelled' component={AppointmentStatusCancelled} /> */}

          <MScreen.Screen
            name='notification'
            component={Notification}
            options={{
              headerShown: false,
              title: 'Notification',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='addpets'
            component={AddPets}
            options={{
              headerShown: false,
              title: 'Add Pets',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='viewpets'
            component={ViewPetsPage}
            options={{
              headerShown: false,
              title: 'View Pets',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='editpets'
            component={EditPetsPage}
            options={{
              headerShown: false,
              title: 'Edit Pets',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='editprofile'
            component={EditProfilePage}
            options={{
              headerShown: false,
              title: 'Edit Profile',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='userprofile'
            component={UserProfilePage}
            options={{
              headerShown: false,
              title: 'User Profile',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='selectpet'
            component={BookAppointmentPets}
            options={{
              headerShown: false,
              title: 'Select Pet',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='service'
            component={BookAppointmentService}
            options={{
              headerShown: false,
              title: 'Service',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='datetime'
            component={BookAppointmentDateTime}
            options={{
              headerShown: false,
              title: 'Date Time',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='summary'
            component={BookAppointmentSummary}
            options={{
              headerShown: false,
              title: 'Summary',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='completed'
            component={AppointmentStatusCompleted}
            options={{
              headerShown: false,
              title: 'Completed',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='pending'
            component={AppointmentStatusPending}
            options={{
              headerShown: false,
              title: 'Pending',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='approved'
            component={AppointmentStatusApproved}
            options={{
              headerShown: false,
              title: 'Approved',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          <MScreen.Screen
            name='cancelled'
            component={AppointmentStatusCancelled}
            options={{
              headerShown: false,
              title: 'Cancelled',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='totalpending'
            component={TotalPending}
            options={{
              headerShown: false,
              title: 'Total Pending',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

              <MScreen.Screen
            name='totalpaid'
            component={TotalPaid}
            options={{
              headerShown: false,
              title: 'Total Paid',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

                <MScreen.Screen
            name='allinvoice'
            component={AllInvoice}
            options={{
              headerShown: false,
              title: 'All Invoice',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

                  <MScreen.Screen
            name='fullinvoice'
            component={FullInvoice}
            options={{
              headerShown: false,
              title: 'Full Invoice',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='paid'
            component={Paid}
            options={{
              headerShown: false,
              title: 'Paid',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

            <MScreen.Screen
            name='unpaid'
            component={Unpaid}
            options={{
              headerShown: false,
              title: 'Unpaid',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

            <MScreen.Screen
            name='overdue'
            component={Overdue}
            options={{
              headerShown: false,
              title: 'Overdue',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

              <MScreen.Screen
            name='paytotalpending'
            component={PayTotalPending}
            options={{
              headerShown: false,
              title: 'Overdue',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='payinvoice'
            component={PayInvoice}
            options={{
              headerShown: false,
              title: 'Pay Invoice',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          
        </MScreen.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}