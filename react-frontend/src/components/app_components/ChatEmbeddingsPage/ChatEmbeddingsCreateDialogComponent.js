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

const ChatEmbeddingsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [userId, setUserId] = useState([])
const [conversationId, setConversationId] = useState([])
const [messageId, setMessageId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [userId,conversationId,messageId], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.content)) {
                error["content"] = `Content field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.embedding)) {
                error["embedding"] = `Embedding field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            userId: _entity?.userId?._id,conversationId: _entity?.conversationId?._id,messageId: _entity?.messageId?._id,content: _entity?.content,embedding: _entity?.embedding,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("chatEmbeddings").create(_data);
        const eagerResult = await client
            .service("chatEmbeddings")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "userId",
                    service : "users",
                    select:["name"]},{
                    path : "conversationId",
                    service : "conversations",
                    select:["title"]},{
                    path : "messageId",
                    service : "messages",
                    select:["content"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Chat Embeddings updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Chat Embeddings" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setUserId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

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

useEffect(() => {
                    // on mount messages
                    client
                        .service("messages")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleMessagesId } })
                        .then((res) => {
                            setMessageId(res.data.map((e) => { return { name: e['content'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Messages", type: "error", message: error.message || "Failed get messages" });
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

    const userIdOptions = userId.map((elem) => ({ name: elem.name, value: elem.value }));
const conversationIdOptions = conversationId.map((elem) => ({ name: elem.name, value: elem.value }));
const messageIdOptions = messageId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Chat Embeddings" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="chatEmbeddings-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userId">User Id:</label>
                <Dropdown id="userId" value={_entity?.userId?._id} optionLabel="name" optionValue="value" options={userIdOptions} onChange={(e) => setValByKey("userId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userId"]) ? (
              <p className="m-0" key="error-userId">
                {error["userId"]}
              </p>
            ) : null}
          </small>
            </div>
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
                <label htmlFor="messageId">Message Id:</label>
                <Dropdown id="messageId" value={_entity?.messageId?._id} optionLabel="name" optionValue="value" options={messageIdOptions} onChange={(e) => setValByKey("messageId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["messageId"]) ? (
              <p className="m-0" key="error-messageId">
                {error["messageId"]}
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
                <label htmlFor="embedding">Embedding:</label>
                <InputText id="embedding" className="w-full mb-3 p-inputtext-sm" value={_entity?.embedding} onChange={(e) => setValByKey("embedding", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["embedding"]) ? (
              <p className="m-0" key="error-embedding">
                {error["embedding"]}
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

export default connect(mapState, mapDispatch)(ChatEmbeddingsCreateDialogComponent);
