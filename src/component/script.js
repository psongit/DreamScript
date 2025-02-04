import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { browserHistory } from "react-router";

import Page from "./page";
import TitlePage from "./titlePage";
import SelectBox from "./selectbox";

@inject("MobxScript")
@observer
export default class Script extends Component {
  /*
    Script get id from params(url), request the script's content from db
  */
  constructor(props) {
    super(props);

    this.id = props.params.id;

    // using _id to get script from db
    props.MobxScript.db.find({ _id: parseInt(this.id) }, (err, doc) => {
      // console.log(this.id, doc)
      if (doc.length != 0) {
        // console.log(doc[0].content, toJS(props.MobxScript.paragraphs))
        props.MobxScript.paragraphs = doc[0].content;
        props.MobxScript.pages = doc[0].pages;
        props.MobxScript.titlePage = doc[0].titlePage;
        props.MobxScript.lastSave = doc[0]._id;
      } else {
        console.log("Can not find script in Database !");
      }
    });
  }
  // componentWillUpdate(a,b){
  //   console.log('this should not be happening... because mobx override this, nothing you can do here!');
  //   return false;
  // }
  handleBack() {
    // save before leaving
    this.props.MobxScript.saveScript();
    browserHistory.replace("/");
  }

  render() {
    const { MobxScript } = this.props;
    return (
      <div
        className="script"
        onKeyDown={(e) =>
          e.target.id === "paragraph" ? MobxScript.handleKey(e) : ""
        }
        onBlur={(e) =>
          e.target.id === "paragraph" ? MobxScript.handleBlur(e) : ""
        }
      >
        <div className="script_tool">
          <div className="script_save" onClick={() => MobxScript.saveScript()}>
            Save
          </div>
          <div className="script_back" onClick={() => this.handleBack()}>
            Back
          </div>
          <div className="script_export" onClick={() => MobxScript.exportScript()}>
            Export
          </div>
        </div>

        <SelectBox script={MobxScript} />
        <TitlePage script={MobxScript} />

        {MobxScript.pages.map((pageIter, i) => (
          <Page
            key={i}
            pageIter={pageIter}
            pageNumber={i}
            script={MobxScript}
          />
        ))}
      </div>
    );
  }
}
