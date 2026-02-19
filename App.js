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
import AddPetsCont from './screens/AddPetsCont';
import PetsAddedPage from './screens/PetsAddedPage';
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

export const Registered = [];
export const Pets = [];

export const Appointments = [];

export default function App() {
  const MScreen = createNativeStackNavigator()

  return (
    <UserProvider>
      <NavigationContainer>
        <MScreen.Navigator initialRouteName='landing'>
          <MScreen.Screen name='landing' component={LandingPage} />
          <MScreen.Screen name='login' component={LoginPage} />
          <MScreen.Screen name='register' component={RegisterPage} />
          <MScreen.Screen name='otp' component={Otp} />
          <MScreen.Screen name='otplogin' component={Otplogin} />
          
          <MScreen.Screen
            name='dashboard'
            component={DashboardPage}
            options={{
              headerShown: true,
              title: 'Home',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='pet'
            component={PetManagementPage}
            options={{
              headerShown: true,
              title: 'Pets',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='appointment'
            component={AppointmentPage}
            options={{
              headerShown: true,
              title: 'Appointment',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />

           <MScreen.Screen
            name='billing'
            component={BillingPage}
            options={{
              headerShown: true,
              title: 'Invoice',
              headerLeft: () => null,
              headerTitleAlign: 'left',
            }}
          />
          
          <MScreen.Screen name='notification' component={Notification} />
          <MScreen.Screen name='addpets' component={AddPets} />
          <MScreen.Screen name='addpetscont' component={AddPetsCont} />
          <MScreen.Screen name='petsadded' component={PetsAddedPage} />
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
          <MScreen.Screen name='cancelled' component={AppointmentStatusCancelled} />
        </MScreen.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}