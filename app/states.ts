import { atom, selector } from "recoil";
import { FilterType, PostType, UserType } from "./model/type";
//theme
export const theme = atom({
  key: "theme-tailwind",
  default: false,
});
//permission

export const audioPermission = atom({
  key: "audioPermission",
  default: false,
});
//textName

export const textName = atom({
  key: "textName",
  default: "",
});

//editorOptios

export const showSearchPanelState = atom({
  key: "showSearch",
  default: false,
});

export const showFontSizeState = atom({
  key: "showfontSize",
  default: false,
});
//threadSelection
export const openSuggestionState = atom({
  key: "openSuggestion",
  default: false,
});

export const selectedSuggestionThread = atom({
  key: "selectedSuggestionThread",
  default: {
    id: "",
  },
});
export const selectedPostThread = atom({
  key: "selectedPostThread",
  default: {
    id: "",
  },
});
//share State

export const shareState = atom({
  key: "sharePost",
  default: false,
});

//filter related states
export const openFilterState = atom({
  key: "openFilter", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export const showLatest = atom<boolean>({
  key: "latestFilter",
  default: true,
});
export const filterDataState = atom<FilterType>({
  key: "filterData",
  default: {
    type: "all",
    date: { startDate: null, endDate: null },
    user: [],
    solved: "both",
  },
});

//text selection

export const selectedTextOnEditor = atom({
  key: "selectionSection",
  default: {
    type: "",
    start: 0,
    end: 0,
    content: "",
  },
});

//user
export const UserState = atom<UserType>({
  key: "userState",
  default: null,
});
