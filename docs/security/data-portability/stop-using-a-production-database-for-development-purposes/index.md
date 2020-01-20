---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A secure design methodology that consists in seeding a database with sample fake data while designing it at the same time.'
keywords: ["security", "database", "development", "production", "fixtures", "tests", "tdd"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
contributor:
    name: Jordi Bassagañas
    link: https://twitter.com/programarivm
title: 'Stop Using a Production Database for Development Purposes'
---

Whether it is because of tight deadlines or budget constraints, it's not too uncommon that software development teams will end up using real production data instead of sample data for development purposes.

However if working locally with a copy of the production database your data is at risk of being sent through email, Skype, or shared on cloud-based platforms such as Slack or Discord, just to name a few.

Remember, this is not the right thing to do since it comes with a number of threats which might even propagate through your DevOps infrastructure.

This guide will show you a secure database design methodology that consists in seeding a development database with sample fake data while designing it at the same time.

Specifically it is implemented with PHP and Symfony but the important software design concepts in place can be easily transferred to other programming languages and frameworks.

## Before You Begin

- Learn the basics of [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)

- Install and set up a fresh copy of [Symfony](https://symfony.com/doc/current/best_practices.html)

- Familiarize yourself with the concepts of [fixtures](https://symfony.com/doc/master/bundles/DoctrineFixturesBundle/index.html) and [migrations](https://symfony.com/doc/master/bundles/DoctrineMigrationsBundle/index.html)

> For further details please visit [programarivm/zebra](https://github.com/programarivm/zebra) which is a GitHub repository where the present methodology has been implemented.

## Fixture-Driven Development

The present design methodology is basically about letting our data fixtures guide the database design process in a similar way as with test-driven development (TDD).

This is how a fixture-driven cycle looks like:

1. Add a fixture
2. Try to load the fixtures and see if they can be loaded
3. Write some code in the entity layer
4. Load the fixtures
5. Repeat

Once the entire process is completed and therefore the database designed, you end up having precious sample data.

## Add a Fixture

Let's assume we are starting the database design process completely from scratch and the very first fixture needs to be added. A good idea might be to write the following fixtures in `src/DataFixtures/UserFixtures.php`

```php
<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setUsername('bob');
        $manager->persist($user);

        $manager->flush();
    }
}
```

## Try to Load the Fixtures

Of course at this point the Symfony console will throw an error if trying to load the user fixtures.

```
php bin/console doctrine:fixtures:load

 Careful, database "zebra" will be purged. Do you want to continue? (yes/no) [no]:
 > yes

   > purging database
   > loading App\DataFixtures\AppFixtures
   > loading App\DataFixtures\UserFixtures
2020-01-20T18:10:52+00:00 [critical] Uncaught Error: Class 'App\Entity\User' not found

In UserFixtures.php line 13:

  Attempted to load class "User" from namespace "App\Entity".  
  Did you forget a "use" statement for another namespace?      
```

This is an equivalent to making a test fail in a TDD methodology.

## Write Some Code in the Entity Layer

So, the entity layer must be refactored with the purpose of just making the previous fixtures to be loaded. A minimal `src/Entity/User.php` file is written to achieve this goal.

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $username;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }
}
```

## Load the Fixtures

The next step after adding the `User` entity is to run the `doctrine:migrations:diff` command in order to generate a migration file by comparing the current database to the mapping information.

```
php bin/console doctrine:migrations:diff
Generated new migration class to "/zebra/src/Migrations/Version20200120182410.php"

To run just this migration for testing purposes, you can use migrations:execute --up 20200120182410

To revert the migration you can use migrations:execute --down 20200120182410
```

Then the migration is run as described next.

```
php bin/console doctrine:migrations:migrate

                    Application Migrations                    


WARNING! You are about to execute a database migration that could result in schema changes and data loss. Are you sure you wish to continue? (y/n)yes
Migrating up to 20200120182410 from 0

  ++ migrating 20200120182410

     -> CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB

  ++ migrated (took 79.2ms, used 12M memory)

  ------------------------

  ++ finished in 87.6ms
  ++ used 12M memory
  ++ 1 migrations executed
  ++ 1 sql queries
```
And finally the fixtures are loaded again.

```
php bin/console doctrine:fixtures:load

 Careful, database "zebra" will be purged. Do you want to continue? (yes/no) [no]:
 > yes

   > purging database
   > loading App\DataFixtures\AppFixtures
   > loading App\DataFixtures\UserFixtures
```

This is how the `user` table will look like after the first fixture-driven development cycle is completed.

```
mysql> select * from user;
+----+----------+
| id | username |
+----+----------+
|  1 | bob      |
+----+----------+
1 row in set (0.00 sec)
```

## Repeat

It is time to prepare the next cycle. On this occasion probably it is a good thing to keep on adding properties to the `User` entity.

```php
<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setUsername('bob')
            ->setEmail('bob@gmail.com');
        $manager->persist($user);

        $manager->flush();
    }
}
```

As expected, the loading of the fixtures will now fail because the `setEmail()` method doesn't still exist in `App\Entity\User`.

```
php bin/console doctrine:fixtures:load

 Careful, database "zebra" will be purged. Do you want to continue? (yes/no) [no]:
 > yes

   > purging database
   > loading App\DataFixtures\AppFixtures
   > loading App\DataFixtures\UserFixtures
2020-01-20T19:34:14+00:00 [critical] Uncaught Error: Call to undefined method App\Entity\User::setEmail()

In UserFixtures.php line 15:

  Attempted to call an undefined method named "setEmail" of class "App\Entity\User".
```

## Conclusion

The objective of the present methodology is to encourage developers to write a suite of fixtures to be loaded in a testing database, this way there is no need to use production data for development purposes.

The fixtures are written when designing the database.

The first fixture-development cycle described above was quite simple but at some point in future cycles the `User` entity may resemble the following.

```php
<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    const N = 20;

    private $encoder;

    private $faker;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
        $this->faker = Factory::create();
        $this->faker->addProvider(new \Faker\Provider\Internet($this->faker));
    }

    public function load(ObjectManager $manager)
    {
        for ($i = 0; $i < self::N; $i++) {
            $user = new User();
            $user->setUsername($this->faker->username)
                ->setEmail($this->faker->email)
                ->setPassword($this->encoder->encodePassword(
                    $user,
                    $this->faker->password
                ));
            $manager->persist($user);
            $this->addReference("user-$i", $user);
        }

        $manager->flush();
    }
}
```

```
mysql> select * from user;
+----+------------------+-----------------------------+---------------------------------------------------------------------------------------------------+
| id | username         | email                       | password                                                                                          |
+----+------------------+-----------------------------+---------------------------------------------------------------------------------------------------+
|  1 | demarcus.koch    | cristal.hagenes@treutel.com | $argon2id$v=19$m=65536,t=4,p=1$LmX8EoXrkemR8VLIO1ZcTA$5UC0tWn+6fJEma/neKcitgpELZlPTAcL9wC6O1nNfn8 |
|  2 | ablanda          | floy73@marks.com            | $argon2id$v=19$m=65536,t=4,p=1$Iq5mhGD4M5bYEvRcszqdsA$9sJExnkdKO2QMR8PA+DFZ+OL8EvCkvJ1WdhkUMuELN8 |
|  3 | ernesto.wolf     | zstanton@hotmail.com        | $argon2id$v=19$m=65536,t=4,p=1$0mV3Wg6DADHoA8XjXu555w$RljkrrtDABBOTkQSNNmBOKA16e2jAcwRnBs6qjOIPhQ |
|  4 | bwhite           | gsmith@gmail.com            | $argon2id$v=19$m=65536,t=4,p=1$7u2ecWB6IedLaMHY+bhb6g$72VHnkYwZw458orExJvvEaoZMLcHoL4f6upn+73qJZ8 |
|  5 | dorris28         | vgrimes@hotmail.com         | $argon2id$v=19$m=65536,t=4,p=1$4+sjf5jOIkNPrgagmsCoMw$qxDBCxNy16ODcPAoDjbo0AgS2TnM/QGxo8kEIqWugSI |
|  6 | xrodriguez       | ledner.verla@franecki.com   | $argon2id$v=19$m=65536,t=4,p=1$YhR3tHoopKSJNhehtZ4sIg$jxxKrrT9R6Weg4IbcSEdHn1WQoNmT2/OYuRfTaGTjjY |
|  7 | rcronin          | ngutkowski@yahoo.com        | $argon2id$v=19$m=65536,t=4,p=1$TKtVQCp4chLWbhiGR+/axA$TbmnyuEmWIdtq5yNzPbjOlYeQNH3tFa612+LYwVxc3Y |
|  8 | wunsch.edwardo   | freda16@wiza.com            | $argon2id$v=19$m=65536,t=4,p=1$Pp9AtCXw/XB6/Z5FiFH3aA$X420Ix4JAGcRu0x2gJdoToVeXSSFlZU33BeDR13/gOQ |
|  9 | jacobi.broderick | ortiz.declan@gmail.com      | $argon2id$v=19$m=65536,t=4,p=1$31b2sF9Gt7WfAdpdLGofLg$PV/T4vCb9NUwprkKCS1N/MFSopHXFLiaGSxRMS/TtKw |
| 10 | halie.beier      | dsimonis@haley.com          | $argon2id$v=19$m=65536,t=4,p=1$FW5MHfVG7evZan5uEEZhUA$S/tlt4LocrW998oDrW3K5k/LE5JUY0ioFMxgICg0pC4 |
| 11 | ortiz.corine     | ostoltenberg@yahoo.com      | $argon2id$v=19$m=65536,t=4,p=1$Vr2hEI+PH6QPBY1elab5cg$wTM9Tkd4IcAyF9Eo0Oxec/ejlC/LgZg5oRtp39gICSQ |
| 12 | uklocko          | emelia.donnelly@hyatt.org   | $argon2id$v=19$m=65536,t=4,p=1$4TvtIIJ1Lf4vHEjnZ+qubg$kOin2zZ40wWCRn3Wkn9U2X9ijmpQJ69duk/Yfh4WnOg |
| 13 | williamson.willy | ikeeling@tillman.com        | $argon2id$v=19$m=65536,t=4,p=1$UdUPCVJFIM2xLtIHMW8iqg$ucx9nuPuS92GXfU1WQGew8YjTBhlJURk7vgzwIZadXk |
| 14 | schoen.tristin   | thompson.zion@mante.com     | $argon2id$v=19$m=65536,t=4,p=1$DvvUHieQhWKFLNZ98NzWJw$QMd3G6zhW9uEPttwXpMk6DMvkr4TrDdFEBLgv3GpV3w |
| 15 | collier.xavier   | emelie.padberg@yahoo.com    | $argon2id$v=19$m=65536,t=4,p=1$hGH8E+gf6fz8IoNJHaFiGA$M6euacVeiTgT5cVHvPctx3cTInWCRfk5b2rX50imOwg |
| 16 | maxine.purdy     | ibednar@herman.info         | $argon2id$v=19$m=65536,t=4,p=1$VrFDOh6XF7bsXkUNyGYHzg$is+BNG3ZyxE0IEazy6ZNmdV/9n3omhgRXpQY4aH63OA |
| 17 | anabelle50       | jmoen@gmail.com             | $argon2id$v=19$m=65536,t=4,p=1$ad/+ztC2VYgoFncfnKvd7w$Swqo2Wg0lHqObIEMRdkI4lwjAIDTG9hy1J30pUa8MGs |
| 18 | titus.damore     | qlowe@hotmail.com           | $argon2id$v=19$m=65536,t=4,p=1$1hUK0xzB1iykjHtGx3cRpA$A/sXhRQwnnzSJ46NFW2te9xO84qs+WW5Y4wFQGdeSL8 |
| 19 | amy.cronin       | kaitlyn66@toy.biz           | $argon2id$v=19$m=65536,t=4,p=1$RTzEBBGF+vrL8heH9I2CMw$bMSFOkbCapen1+3+feJmWQ/77hdjiHShrjbVudTxN9s |
| 20 | darryl64         | friedrich00@feeney.com      | $argon2id$v=19$m=65536,t=4,p=1$dYpnao4o5MXhLEgzY82Q5A$hZ+4JR7/2ZjW2WLG1HJa8mTNFnBWLrYmDj4SuuhWCwc |
+----+------------------+-----------------------------+---------------------------------------------------------------------------------------------------+
20 rows in set (0.00 sec)
```

For further details please visit [programarivm/zebra](https://github.com/programarivm/zebra) which is a GitHub repository where the present methodology has been implemented.
