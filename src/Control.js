import PropTypes from "prop-types";
import React from "react";
import axios from "axios";
import "./Control.css";
export default class Control extends React.Component {
  constructor(props) {
    super(props);
    this.state = { obj: JSON.parse(props.value) };
  }
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    forID: PropTypes.string,
    value: PropTypes.node,
    title: PropTypes.node,
    classNameWrapper: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: JSON.stringify({
      url: "https://",
      title: "",
      description: "",
      image: "",
    }),
    title: "",
  };

  render() {
    const { forID, value, onChange, classNameWrapper, title } = this.props;
    return (
      <div className={classNameWrapper}>
        <div className="flex">
          <input
            type="text"
            id={forID}
            value={this.state.obj.url || ""}
            onChange={(e) => {
              this.setState({
                obj: Object.assign({}, this.state.obj, { url: e.target.value }),
              });
            }}
          />
          <button onClick={(e) => this.getURLPreview(this.state.obj.url)}>
            Tarik Data
          </button>
          <button onClick={(e) => onChange(JSON.stringify(this.state.obj))}>
            Simpan
          </button>
        </div>
        <label for="title">Judul</label>
        <input
          type="text"
          value={this.state.obj.title || ""}
          id="title"
          className="input-box"
        ></input>
        <label for="summary">Summary</label>
        <textarea
          id="summary"
          value={this.state.obj.description}
          className="text-box"
          rows="10"
        >
          {this.state.obj.description}
        </textarea>
        <img src={this.state.obj.image}></img>
      </div>
    );
  }
  getRun(data) {
    return new Promise((resolve, reject) => {
      const run = axios.post(
        "https://api.apify.com/v2/acts/jancurn~extract-metadata/runs?token=YsRfHhAHa6n5YDCBuitxNHHev&limit=1&desc=true",
        data
      );
      run.then((e) => {
        resolve(e.data.data);
      });
    });
  }
  getStatus(actId, id) {
    return new Promise((resolve, reject) => {
      const status = axios.get(
        `https://api.apify.com/v2/acts/${actId}/runs/${id}?token=YsRfHhAHa6n5YDCBuitxNHHev`
      );
      status.then((e) => {
        resolve(e.data.data);
      });
    });
  }
  getOutput(keyId) {
    return new Promise((resolve, reject) => {
      const output = axios.get(
        `https://api.apify.com/v2/key-value-stores/${keyId}/records/OUTPUT?disableRedirect=1&token=YsRfHhAHa6n5YDCBuitxNHHev&limit=1&desc=true`
      );
      output.then((e) => {
        resolve(e.data);
      });
    });
  }
  getURLPreview(value) {
    if (value && value !== "") {
      const that = this;
      const run = this.getRun({
        url: value,
      });
      run.then((e) => {
        let retry = setInterval(() => {
          const status = this.getStatus(e.actId, e.id);
          status.then((f) => {
            if (f.status === "SUCCEEDED") {
              clearInterval(retry);
              const output = this.getOutput(f.defaultKeyValueStoreId);
              output.then((e) => {
                this.setState({
                  obj: Object.assign({}, this.state.obj, {
                    title: e.title,
                    description: e.meta.description || e.meta["og:description"],
                    image: e.meta["og:image"] || e.meta["twitter:image"],
                  }),
                });
              });
            }
          });
        }, 3000);
      });
    }
  }
}
