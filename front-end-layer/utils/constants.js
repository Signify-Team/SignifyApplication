/**
 * @file constants.js
 * @description Includes constants for the application for consistency.
 *
 * @datecreated 05.11.2024
 * @lastmodified 16.12.2024
 */

export const COLORS = {
    primary: '#8EB1CF',
    secondary: '#F76C63',
    tertiary: '#87CB97',
    neutral_base_dark: '#333333',
    neutral_base_soft: '#D1E2EC',
    button_color: '#EB4511',
    highlight_color_2: '#EE3C3C',
    dark_accent: '#2C2C2C',
    soft_accent: '#F9E2D0',
    dark_gray_1: '#969797',
    lemonade: '#FFFFC7',
    bright_button_color: '#4068F5',
    light_gray_1: '#DDDDDD',
    light_gray_2: '#EEEEEE',
    soft_pink_background: '#FFE5E5',
    gray: '#D9D9D9',
    paw_color: '#8EB1CF',
    soft_container_color: '#B3D0E8',
};

export const FONTS = {
    title: 24,
    body: 16,
};

export const SIZES = {
    statsContainer: 0.09,
    badgesContainer: 0.085,
};

// Converts hex to rgba for opacity handling in styles
export const hexToRgba = (hex, opacity) => {
    let r = 0, g = 0, b = 0;

    // Handle shorthand hex (#RGB)
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // Handle full hex (#RRGGBB)
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
