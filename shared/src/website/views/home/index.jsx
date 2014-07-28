/** @jsx React.DOM */
(function() {
    "use strict";

    var React = require('react'),
        ExtensionLoader = require('fora-extensions').Loader,
        ForaUI = require('fora-ui'),
        Models = require('../../../models');

    var Page = ForaUI.Page,
        Content = ForaUI.Content,
        Cover = ForaUI.Cover,
        loader = new ExtensionLoader();


    module.exports = React.createClass({
        statics: {
            componentInit: function*(props) {
                /* Convert the JSON into Post objects and attach the templates */
                var posts = props.featured.concat(props.editorsPicks);
                for (var i = 0; i < posts.length; i++) {
                    if (!(posts[i] instanceof Models.Post)) posts[i] = new Models.Post(posts[i]);
                    var typeDef = yield* posts[i].getTypeDefinition();
                    var extension = yield* loader.load(typeDef);
                    posts[i].template = yield* extension.getTemplateModule('list');
                }
                return props;
            }
        },

        render: function() {
            var createItem = function(post) {
                return post.template({ key: post._id, post: post, forum: post.forum, author: post.createdBy });
            };

            return (
                <Page>
                    <Cover cover={this.props.cover} coverContent={this.props.coverContent} />
                    <Content>
                        <nav>
                            <ul>
                                <li className="selected">
                                    Posts
                                </li>
                                <li>
                                    <a href="/forums">Forums</a>
                                </li>
                            </ul>
                        </nav>
                        <div className="content-area">
                            <ul className="articles default-view">
                                {this.props.editorsPicks.map(createItem)}
                            </ul>
                            <ul className="articles default-view">
                                {this.props.featured.map(createItem)}
                            </ul>
                        </div>
                    </Content>
                </Page>
            );
        }
    });

})();
