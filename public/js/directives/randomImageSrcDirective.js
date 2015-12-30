/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 30/12/15
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */


angular.module ('cms.directives')

.directive('randomSrc',function($interval){

        return {
            scope:{
                  images:'='
            },
            link:function(scope, element, attrs){

                function getRandomIntInclusive(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }


                var index = 0;

                $interval(function(){
                    index = getRandomIntInclusive(0,scope.images.length-1);
                    attrs.$set('src',scope.images[index]);

                },10000);

                attrs.$set('src',scope.images[0]);
            }
        }

    });