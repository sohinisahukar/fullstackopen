describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset').then((response) => {
      cy.log('Database reset response:', response)
    })
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword'
    }
    const anotherUser = {
      name: 'Another User',
      username: 'anotheruser',
      password: 'anotherpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user).then((response) => {
      cy.log('User creation response:', response)
    })
    cy.request('POST', 'http://localhost:3003/api/users/', anotherUser).then((response) => {
      cy.log('Another user creation response:', response)
    })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.get('form').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()

      cy.contains('Test User logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()

      cy.contains('Test User logged-in')

    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('New Blog Title')
      cy.get('input[name="author"]').type('Blog Author')
      cy.get('input[name="url"]').type('http://newblog.com')
      cy.contains('add blog').click()
      cy.contains('New Blog Title Blog Author')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('Another Blog Title')
      cy.get('input[name="author"]').type('Another Blog Author')
      cy.get('input[name="url"]').type('http://anotherblog.com')
      cy.contains('add blog').click()
      cy.contains('Another Blog Title Another Blog Author')
      cy.contains('Another Blog Title Another Blog Author').parent().find('button').contains('view').click()
      cy.contains('Another Blog Title Another Blog Author').parent().find('button').contains('like').click()
      cy.contains('Another Blog Title Another Blog Author').parent().contains('likes 1')
    })

    it('A blog can be deleted by the user who created it', function() {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('Blog to be deleted')
      cy.get('input[name="author"]').type('Delete Author')
      cy.get('input[name="url"]').type('http://deleteblog.com')
      cy.contains('add blog').click()
      cy.contains('Blog to be deleted Delete Author')
      cy.contains('Blog to be deleted Delete Author').parent().find('button').contains('view').click()
      cy.contains('Blog to be deleted Delete Author').parent().find('button').contains('remove').click({ force: true })
      cy.contains('Blog to be deleted Delete Author').should('not.exist')
    })

    it('Only the creator can see the delete button', function() {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('Blog with delete button')
      cy.get('input[name="author"]').type('Delete Author')
      cy.get('input[name="url"]').type('http://deletebutton.com')
      cy.contains('add blog').click()
      cy.contains('Blog with delete button Delete Author')
      cy.contains('Blog with delete button Delete Author').parent().find('button').contains('view').click()
      cy.contains('Blog with delete button Delete Author').parent().find('button').contains('remove').should('be.visible')
      cy.contains('logout').click()
      cy.get('#username').type('anotheruser')
      cy.get('#password').type('anotherpassword')
      cy.get('#login-button').click()
      cy.contains('Another User logged-in')
      cy.contains('Blog with delete button Delete Author').parent().find('button').contains('view').click()
      cy.contains('Blog with delete button Delete Author').parent().find('button').contains('remove').should('not.be.visible')
    })

    it('Blogs are ordered by likes', function() {

      cy.createBlog({
        title: 'First Blog',
        author: 'First Author',
        url: 'http://firstblog.com',
        likes: 0
      })
      cy.createBlog({
        title: 'Second Blog',
        author: 'Second Author',
        url: 'http://secondblog.com',
        likes: 0
      })
      cy.createBlog({
        title: 'Third Blog',
        author: 'Third Author',
        url: 'http://thirdblog.com',
        likes: 0
      })

      cy.contains('First Blog').parent().find('button').contains('view').click()
      cy.contains('First Blog').parent().find('button').contains('like').as('likeButton1')

      cy.contains('Second Blog').parent().find('button').contains('view').click()
      cy.contains('Second Blog').parent().find('button').contains('like').as('likeButton2')

      cy.contains('Third Blog').parent().find('button').contains('view').click()
      cy.contains('Third Blog').parent().find('button').contains('like').as('likeButton3')

      // Like the first blog 3 times
      cy.get('@likeButton1').click()
      cy.contains('likes 1')
      cy.get('@likeButton1').click()
      cy.contains('likes 2')
      cy.get('@likeButton1').click()
      cy.contains('likes 3')

      // Like the second blog 2 times
      cy.get('@likeButton2').click()
      cy.contains('likes 1')
      cy.get('@likeButton2').click()
      cy.contains('likes 2')

      // Like the third blog 1 time
      cy.get('@likeButton3').click()
      cy.contains('likes 1')

      // Check order of blogs
      cy.get('.blog').eq(0).should('contain', 'First Blog')
      cy.get('.blog').eq(1).should('contain', 'Second Blog')
      cy.get('.blog').eq(2).should('contain', 'Third Blog')
    })
  })
})
