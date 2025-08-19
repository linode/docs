class Celsius:
    def __init__(self, temp=22):
        self._temp = temp

    def to_fahrenheit(self):
        return (self._temp * 1.8) + 32

    @property
    def temp(self):
        return self._temp

    @temp.setter
    def temp(self, value):
        if value < -273.15:
            raise ValueError("Temperature cannot be less than absolute zero")
        self._temp = value

