const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        font: ["Plus Jakarta Sans"],
      },
      colors: {
        Button_filter_color: "#4B5563",
        Button_Delete_color: "#FF3B3B",
        Button_Submit_color: "#957B62",
        Button_Submit_color_text: "#FFFFFF",
        Heading_Text_color: "#1E1E1E",
        Label_Text_color: "#4B5563",
        Upload_Text_color: "#8067FE",
        Sidebar_active_color: "#744F30",
        Sidebar_active_bg: "#f1e8e4",


      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  variants: {
    display: ["group-hover"],
  },
};

module.exports = {
  ...config,
};
