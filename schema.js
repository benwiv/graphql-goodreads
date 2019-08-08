const fetch = require('node-fetch');
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString);
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

// fetch(
//   'https://www.goodreads.com/author/show.xml?id=4432&key=yonTidW5AzGRGKNLxqJL5A'
// )
// .then(response => response.text())
// .then(parseXML)

const BookType = new GraphQLObjectType({
  name:'Book',
  description: '...',

  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: xml => {
        return xml.title[0];
      }
    },
    isbn: {
      type: GraphQLString,
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: (xml) => {
        return xml.GoodreadsResponse.author[0].name[0];
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: xml => {
        return xml.GoodreadsResponse.author[0].books[0].book;
      },
    },
  })
})

module.exports = new GraphQLSchema({
  query:new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args) => {
          return (
            fetch(
              `https://www.goodreads.com/author/show.xml?id=${args.id}&key=yonTidW5AzGRGKNLxqJL5A`
            )
            .then(response => response.text())
            .then(parseXML)
          )
        },
      }
    })
  })
});