/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const MessagesEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [conversationId, setConversationId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount conversations
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

    const onSave = async () => {
        let _data = {
            conversationId: _entity?.conversationId?._id,
role: _entity?.role,
content: _entity?.content,
sources: _entity?.sources,
        };

        setLoading(true);
        try {
            
        await client.service("messages").patch(_entity._id, _data);
        const eagerResult = await client
            .service("messages")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "conversationId",
                    service : "conversations",
                    select:["title"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info messages updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

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
        <Dialog header="Edit Messages" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="messages-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="conversationId">Conversation Id:</label>
                <Dropdown id="conversationId" value={_entity?.conversationId?._id} optionLabel="name" optionValue="value" options={conversationIdOptions} onChange={(e) => setValByKey("conversationId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["conversationId"]) && (
              <p className="m-0" key="error-conversationId">
                {error["conversationId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="role">Role:</label>
                <InputText id="role" className="w-full mb-3 p-inputtext-sm" value={_entity?.role} onChange={(e) => setValByKey("role", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["role"]) && (
              <p className="m-0" key="error-role">
                {error["role"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="content">Content:</label>
                <InputText id="content" className="w-full mb-3 p-inputtext-sm" value={_entity?.content} onChange={(e) => setValByKey("content", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["content"]) && (
              <p className="m-0" key="error-content">
                {error["content"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="sources">Sources:</label>
                <InputText id="sources" className="w-full mb-3 p-inputtext-sm" value={_entity?.sources} onChange={(e) => setValByKey("sources", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["sources"]) && (
              <p className="m-0" key="error-sources">
                {error["sources"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
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

export default connect(mapState, mapDispatch)(MessagesEditDialogComponent);
