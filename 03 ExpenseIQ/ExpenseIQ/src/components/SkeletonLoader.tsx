import React, {
    useEffect,
    useRef,
} from 'react';

import {
    Animated,
    View,
} from 'react-native';

const SkeletonLoader = () => {
    const opacity =
        useRef(
            new Animated.Value(
                0.3,
            ),
        ).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    opacity,
                    {
                        toValue: 1,
                        duration: 700,
                        useNativeDriver:
                            true,
                    },
                ),
                Animated.timing(
                    opacity,
                    {
                        toValue: 0.3,
                        duration: 700,
                        useNativeDriver:
                            true,
                    },
                ),
            ]),
        ).start();
    }, []);

    return (
        <View>
            {Array.from({
                length: 5,
            }).map(
                (_, index) => (
                    <Animated.View
                        key={index}
                        style={{
                            opacity,
                            height: 80,
                            borderRadius: 10,
                            backgroundColor:
                                '#E0E0E0',
                            marginBottom: 12,
                        }}
                    />
                ),
            )}
        </View>
    );
};

export default SkeletonLoader;