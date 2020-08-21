import PropTypes from "prop-types";
import React from "react";
import "./Control.css";
export default function Preview({ value }) {
  const state = JSON.parse(value);
  return (
    <div>
      <img src={state.image} className="width-full"></img>
      <h1>{state.title}</h1>
      <p>{state.description}</p>
    </div>
  );
}

Preview.propTypes = {
  value: PropTypes.node,
};
