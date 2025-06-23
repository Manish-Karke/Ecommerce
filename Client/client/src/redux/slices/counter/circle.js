import { createSlice } from "@reduxjs/toolkit";

export const circleSlice = createSlice({
  name: "box",
  initialState: {
    backgroundColor: "green",
    borderRadius: 1000,
    width: 100,
    height: 100,
    value: 0,
    left: 50,
    right: 50,
    buttom: 50,
    top: 50,
  },
  reducers: {
    incrementHeight: (state) => {
      state.height += 1;
    },
    incrementWidth: (state) => {
      state.width += 10;
    },
    decrementHeight: (state) => {
      state.height -= 1;
    },
    decrementWidth: (state) => {
      state.width -= 10;
    },
    changeColor: (state, action) => {
      state.backgroundColor = "yellow";
    },
    leftposition: (state, action) => {
      state.left -= 10;
      state.right += 10;
    },
    rightposition: (state, action) => {
      state.right -= 10;
      state.left += 10;
    },
    buttonposition: (state, action) => {
      state.buttom -= 10;
      state.top += 10;
    },
    topposition: (state, action) => {
      state.buttom += 10;
      state.top -= 10;
    },
    increaseborder: (state, action) => {
      state.height += 10;
      state.width += 10;
      state.borderRadius = Math.min(state.height, state.width) / 2;
    },
    decreaseborder: (state, action) => {
      state.height -= Math.max(10, state.height - 10);
      state.width -= Math.max(10, state.width - 10);

      state.borderRadius = Math.min(state.height, state.width) / 2;
    },
    makeCircle: (state, action) => {
      const minSide = Math.min(state.width, state.height);
      state.width = minSide;
      state.height = minSide;
      state.borderRadius = minSide / 2;
    },
  },
});

export const {
  incrementHeight,
  incrementWidth,
  decrementWidth,
  decrementHeight,
  changeColor,
  leftposition,
  rightposition,
  buttonposition,
  topposition,
  makeCircle,
  increaseborder,
  decreaseborder,
} = circleSlice.actions;

export default circleSlice.reducer;
