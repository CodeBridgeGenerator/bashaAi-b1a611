import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const MessagesCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [conversationId, setConversationId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [conversationId], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.role)) {
                error["role"] = `Role field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.content)) {
                error["content"] = `Content field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.sources)) {
                error["sources"] = `Sources field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            conversationId: _entity?.conversationId?._id,role: _entity?.role,content: _entity?.content,sources: _entity?.sources,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("messages").create(_data);
        const eagerResult = await client
            .service("messages")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "conversationId",
                    service : "conversations",
                    select:["title"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Messages updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Messages" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount conversations
                    client
                        .service("conversations")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleConversationsId } })
                        .then((res) => {
                            setConversationId(res.data.map((e) => { return { name: e['title'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Conversations", type: "error", message: error.message || "Failed get conversations" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const conversationIdOptions = conversationId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Messages" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="messages-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="conversationId">Conversation Id:</label>
                <Dropdown id="conversationId" value={_entity?.conversationId?._id} optionLabel="name" optionValue="value" options={conversationIdOptions} onChange={(e) => setValByKey("conversationId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["conversationId"]) ? (
              <p className="m-0" key="error-conversationId">
                {error["conversationId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="role">Role:</label>
                <InputText id="role" className="w-full mb-3 p-inputtext-sm" value={_entity?.role} onChange={(e) => setValByKey("role", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["role"]) ? (
              <p className="m-0" key="error-role">
                {error["role"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="content">Content:</label>
                <InputText id="content" className="w-full mb-3 p-inputtext-sm" value={_entity?.content} onChange={(e) => setValByKey("content", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["content"]) ? (
              <p className="m-0" key="error-content">
                {error["content"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="sources">Sources:</label>
                <InputText id="sources" className="w-full mb-3 p-inputtext-sm" value={_entity?.sources} onChange={(e) => setValByKey("sources", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["sources"]) ? (
              <p className="m-0" key="error-sources">
                {error["sources"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(MessagesCreateDialogComponent);
