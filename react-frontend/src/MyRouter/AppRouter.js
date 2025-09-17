import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import SingleWorkspacesPage from "../components/app_components/WorkspacesPage/SingleWorkspacesPage";
import WorkspaceProjectLayoutPage from "../components/app_components/WorkspacesPage/WorkspaceProjectLayoutPage";
import SingleWorkspaceMembersPage from "../components/app_components/WorkspaceMembersPage/SingleWorkspaceMembersPage";
import WorkspaceMemberProjectLayoutPage from "../components/app_components/WorkspaceMembersPage/WorkspaceMemberProjectLayoutPage";
import SingleConversationsPage from "../components/app_components/ConversationsPage/SingleConversationsPage";
import ConversationProjectLayoutPage from "../components/app_components/ConversationsPage/ConversationProjectLayoutPage";
import SingleMessagesPage from "../components/app_components/MessagesPage/SingleMessagesPage";
import MessageProjectLayoutPage from "../components/app_components/MessagesPage/MessageProjectLayoutPage";
import SingleChatEmbeddingsPage from "../components/app_components/ChatEmbeddingsPage/SingleChatEmbeddingsPage";
import ChatEmbeddingProjectLayoutPage from "../components/app_components/ChatEmbeddingsPage/ChatEmbeddingProjectLayoutPage";
//  ~cb-add-import~

const AppRouter = () => {
    return (
        <Routes>
            {/* ~cb-add-unprotected-route~ */}
            <Route element={<ProtectedRoute redirectPath={'/login'} />}>
<Route path="/workspaces/:singleWorkspacesId" exact element={<SingleWorkspacesPage />} />
<Route path="/workspaces" exact element={<WorkspaceProjectLayoutPage />} />
<Route path="/workspaceMembers/:singleWorkspaceMembersId" exact element={<SingleWorkspaceMembersPage />} />
<Route path="/workspaceMembers" exact element={<WorkspaceMemberProjectLayoutPage />} />
<Route path="/conversations/:singleConversationsId" exact element={<SingleConversationsPage />} />
<Route path="/conversations" exact element={<ConversationProjectLayoutPage />} />
<Route path="/messages/:singleMessagesId" exact element={<SingleMessagesPage />} />
<Route path="/messages" exact element={<MessageProjectLayoutPage />} />
<Route path="/chatEmbeddings/:singleChatEmbeddingsId" exact element={<SingleChatEmbeddingsPage />} />
<Route path="/chatEmbeddings" exact element={<ChatEmbeddingProjectLayoutPage />} />
                {/* ~cb-add-protected-route~ */}
            </Route>
        </Routes>
    );
}

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(AppRouter);
