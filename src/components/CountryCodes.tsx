
interface CountryCode {
    code: string;
    country: string;
    flag: string; // Path to the flag image
  }
  
  const countryCodes: CountryCode[] = [
    { code: "+84", country: "Vietnam", flag: "/flags/vietnam.png" },
    { code: "+1", country: "United States", flag: "/flags/usa.png" },
    { code: "+44", country: "United Kingdom", flag: "/flags/uk.png" },
    { code: "+81", country: "Japan", flag: "/flags/japan.png" },
    { code: "+86", country: "China", flag: "/flags/china.png" },
    // Add more countries as needed
  ];
  
  export const getCountryByCode = (phone: string): CountryCode | undefined => {
    const code = phone.match(/^\+\d+/)?.[0] || "";
    return countryCodes.find((country) => country.code === code);
  };
  
  export default countryCodes;