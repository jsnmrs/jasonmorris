var test = require('tape');
var fs = require('fs');
var jsyaml = require('js-yaml');

var path = '_posts/';

// build array of _posts
var posts = fs.readdirSync(path);

function readPost(filename) {
  var buffer = fs.readFileSync(filename),
    file = buffer.toString('utf8');

  try {
    var parts = file.split(/---\s*[\n^]/),
      frontmatter = parts[1];

    return {
      name: filename,
      file: file,
      metadata: jsyaml.load(frontmatter),
      content: parts[2]
    };
  } catch (err) {
    console.log(
      '\nCould not read metadata, check the syntax of the metadata and front matter.\n'
    );
  }
}

function readData(dir, filename) {
  var buffer = fs.readFileSync(dir + filename),
    file = buffer.toString('utf8');

  try {
    return {
      name: filename,
      file: file,
      metadata: jsyaml.load(file)
    };
  } catch (err) {}
}

// POST TESTS
posts.forEach(function(post) {
  var file = readPost(path + post);

  var metadata = file.metadata;
  var content = file.content;

  test(path + post, function(t) {
    t.ok(metadata.title, 'must have a title');
    t.ok(metadata.layout, 'must have a layout');
    t.equal(metadata.layout, 'post', 'must have layout: post');

    if (metadata.tags) {
      t.equal(metadata.tags.length < 5, true, 'no more than 4 tags');
    }

    t.end();
  });
});
