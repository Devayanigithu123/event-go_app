interface Spacing {
    space_2: number;
    space_6: number;
    space_4: number;
    space_8: number;
    space_10: number;
    space_12: number;
    space_15: number;
    space_16: number;
    space_18: number;
    space_20: number;
    space_24: number;
    space_28: number;
    space_30: number;
    space_32: number;
    space_36: number;
}

export const SPACING: Spacing = {
    space_2: 2,
    space_4: 4,
    space_6: 6,
    space_8: 8,
    space_10: 10,
    space_12: 12,
    space_15: 15,
    space_16: 16,
    space_18: 18,
    space_20: 20,
    space_24: 24,
    space_28: 28,
    space_30: 30,
    space_32: 32,
    space_36: 36,
};

interface Color {
    Black: string;
    BlackRGB10: string;
    Orange: string;
    OrangeRGBA0: string;
    Grey: string;
    Gray: string;
    DarkGrey: string;
    Yellow: string;
    White: string;
    lightWhite: string;
    WhiteRGBA74: string;
    WhiteRGBA50: string;
    WhiteRGBA32: string;
    WhiteRGBA15: string;
    Primary: string; 
    primaryLight: string;
}

export const COLORS: Color = {
    Black: '#000000',
    BlackRGB10: "rgba(0,0,0,0.1)", 
    Orange: '#FF5524',
    OrangeRGBA0: 'rgba(255,85,36,0)', 
    Grey: '#747d8c',
    Gray: '#747d8c', 
    DarkGrey: '#0B0B0B',
    Yellow: '#e1cd17',
    White: '#FFFFFF',
    lightWhite: 'rgba(255,255,255,0.7)',
    WhiteRGBA74: 'rgba(255,255,255,0.75)', 
    WhiteRGBA50: 'rgba(255,255,255,0.50)', 
    WhiteRGBA32: 'rgba(255,255,255,0.32)', 
    WhiteRGBA15: 'rgba(255,255,255,0.15)', 
    Primary: '#FF6B00', 
    primaryLight: '#FF9A56',
};

interface FontFamily {
    poppins_black: string;
    poppins_bold: string;
    poppins_extrabold: string;
    poppins_extralight: string;
    poppins_light: string;
    poppins_medium: string;
    poppins_regular: string;
    poppins_semibold: string;
    poppins_thin: string;
}

export const FONTFAMILY: FontFamily = {
    poppins_black: 'Poppins_Black',
    poppins_bold: 'Poppins_Bold',
    poppins_extrabold: 'Poppins_Extrabold',
    poppins_extralight: 'Poppins_ExtraLight', 
    poppins_light: 'Poppins_Light',
    poppins_medium: 'Poppins_Medium',
    poppins_regular: 'Poppins_Regular',
    poppins_semibold: 'Poppins_SemiBold', 
    poppins_thin: 'Poppins_Thin',
};

interface FontSize {
    size_8: number;
    size_10: number;
    size_12: number;
    size_14: number;
    size_16: number;
    size_18: number;
    size_20: number;
    size_22: number;
    size_24: number;
    size_30: number;
}

export const FONTSIZE: FontSize = {
    size_8: 8,
    size_10: 10,
    size_12: 12,
    size_14: 14,
    size_16: 16,
    size_18: 18,
    size_20: 20,
    size_22: 22,
    size_24: 24,
    size_30: 30,
};

interface BorderRadius {
    radius_4: number;
    radius_8: number;
    radius_10: number;
    radius_15: number;
    radius_20: number;
    radius_25: number;
}

export const BorderRadius: BorderRadius = {
    radius_4: 4,
    radius_8: 8,
    radius_10: 10,
    radius_15: 15,
    radius_20: 20,
    radius_25: 25,
};

