import { useEffect, useLayoutEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

const useTabBarVisibility = ({ navigation }) => {
  useLayoutEffect(() => {
    const bottomTabBarStyle = {
      tabBarStyle: {
        display: 'none', // Show or hide based on tabBarVisible state
      },
    };
    navigation?.getParent()?.setOptions(bottomTabBarStyle);

    return () => navigation?.getParent()?.setOptions({
      tabBarStyle: {
        display: 'flex' // Override display property
      },
    });
  }, [navigation]);

  return true;
};

export default useTabBarVisibility;
