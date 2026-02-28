
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LiabilityDetailScreen from '../screens/LiabilityDetailScreen';
import CascoDetailScreen from '../screens/CascoDetailScreen'
import AutoAssistanceScreen from '../screens/AutoAssistnaceScreen';

export default function RootNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen
            name = "Home"
            component = {HomeScreen}
            options={{ title: 'AutoBumper' }}
            />
            <Stack.Screen
                name="Liability"
                component={LiabilityDetailScreen}
                options={{ title: 'Insurance Offers' }}
            />
            <Stack.Screen 
                name="Casco" 
                component={CascoDetailScreen} 
                options={{ title: 'Full CASCO' }} 
            />
            <Stack.Screen
                name = "Assistance"
                component={AutoAssistanceScreen}
                options={{title: 'Auto Assistance'}}
                />

        </Stack.Navigator>

    );
}