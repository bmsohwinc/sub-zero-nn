class Animal():
    def __init__(self, size): # [!!] Constructor
        self.size = size
    
    def move(self): # [!!] self param is a must
        print(f'Animal of {self.size} size is moving...')

class Dog(Animal): # [!!] This is how you inherit
    attr1 = "mammal"

    def __init__(self, name, size):
        self.name = name
        Animal.__init__(self, size) # [!!] Without this, Dog.size won't be accessible
    
    def speak(self):
        print(f'My name is {self.name}')
    
    def move(self):
        super().move() # [!!] calling super is the same way
        print(f'It\'s a Dog, named {self.name}')

Dobby = Dog("Dobby", 'small')
Tommy = Dog("Tommy", 'large')

print(f'Dobby is a {Dobby.__class__.attr1}')
print(f'Tommy is also a {Tommy.attr1}') # Both work

Dobby.speak()
Tommy.speak()

Dobby.move()
Tommy.move()
